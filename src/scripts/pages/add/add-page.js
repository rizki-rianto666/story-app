import Camera from "../../camera";
import * as storiesModel from "../../models/stories-model";
import { getCoords } from "../../utils";
import AddStoryPresenter from "./add-presenter";

export default class AddStoryPage {
  #presenter;
  #camera;
  #isCameraOpen = false;
  #takenPhoto = null;
  #selectedCoords = null;

  async render() {
    return `
    <section id="add-story-section">
      <form aria-label="Add Story Form" id="add-story-form" enctype="multipart/form-data">
        <div>
          <label for="description">Description</label>
          <textarea id="description" name="description" required></textarea>
        </div>

        <div>
          <label for="photo">Photo</label>
          <input type="file" id="photo" name="photo" accept="image/*" />
        </div>

        <div>
          <label for="include-location">
            <input type="checkbox" id="include-location" name="include-location" />
            Include Location
          </label>
        </div>

        <div id="add-map-view" style="height:300px; width:500px;">

        </div>

        <button id="open-camera-button" class="btn btn-outline" type="button">
          Buka Kamera
        </button>

        <div id="camera-container">
          <video id="camera-video">
            Video stream not available
          </video>
          
          <div class="camera-tools-container">
            <select id="camera-select"></select>
            <div class="camera-tools-buttons">
              <button id="camera-take-button" class="btn" type="button">
                Ambil Gambar
              </button>
            </div>
          </div>

          <canvas id="camera-canvas">
          </canvas>
        </div>

        <button type="submit">Post Story</button>
      </form>
    </section>
    `;
  }

  async afterRender() {
    this.#presenter = new AddStoryPresenter({
      view: this,
      model: storiesModel,
    });

    this.#setForm();
    document
      .getElementById("open-camera-button")
      .addEventListener("click", () => {
        this.#setupCamera();
      });
  }

  #setForm() {
    const includeLocationCheckbox = document.getElementById("include-location");
    includeLocationCheckbox.addEventListener("change", () => {
      console.log(
        "Location checkbox changed:",
        includeLocationCheckbox.checked
      );

      const mapContainer = document.getElementById("add-map-view");
      if (includeLocationCheckbox.checked) {
        // Show and initialize map
        mapContainer.style.display = "block";
        this.#setMap();
      } else {
        // Hide map and clear coordinates
        mapContainer.style.display = "none";
        this.#selectedCoords = null;
      }
    });
    document
      .getElementById("add-story-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const description = document.getElementById("description").value;
        const includeLocation =
          document.getElementById("include-location").checked;

        const photoInput = document.getElementById("photo").files[0];
        const formData = new FormData();

        const photo = this.#takenPhoto || photoInput;
        if (!photo) {
          alert("Please select or take a photo.");
          return;
        }

        formData.append("description", description);
        formData.append("photo", photo);

        if (includeLocation) {
          if (this.#selectedCoords) {
            formData.append("lat", this.#selectedCoords.lat);
            formData.append("lon", this.#selectedCoords.lon);
          } else if (navigator.geolocation) {
            try {
              const position = await getCoords();
              formData.append("lat", position.coords.latitude);
              formData.append("lon", position.coords.longitude);
            } catch (err) {
              console.warn("Geolocation failed, proceeding without location.");
            }
          }
        }

        await this.#presenter.addStory(formData);
      });

    const cameraContainer = document.getElementById("camera-container");
    document
      .getElementById("open-camera-button")
      .addEventListener("click", async (event) => {
        cameraContainer.classList.toggle("open");

        this.#isCameraOpen = cameraContainer.classList.contains("open");
        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Tutup Kamera";
          this.#setupCamera();
          this.#camera.launch();

          return;
        }

        event.currentTarget.textContent = "Buka Kamera";
        this.#camera.stop();
      });
  }

  async #setMap() {
    const mapContainer = document.getElementById("add-map-view");

    if (mapContainer._leaflet_id) return;

    // Initialize with default center (Indonesia)
    const map = L.map("add-map-view").setView([-2.5489, 118.0149], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    let selectedMarker = null;

    // Try to get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Recenter the map
          map.setView([latitude, longitude], 13);

          // Add marker to user location
          selectedMarker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("Your location")
            .openPopup();

          // Save to private field
          this.#selectedCoords = { lat: latitude, lon: longitude };
        },
        (error) => {
          console.warn("Geolocation failed or denied:", error);
          // fallback remains centered in Indonesia
        }
      );
    }

    // Let user click to update location
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;

      if (selectedMarker) {
        map.removeLayer(selectedMarker);
      }

      selectedMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(
          `<b>Lokasi yang dipilih</b> <br>
          <i>Lat: ${lat}</i> <br>
          <i>Lon: ${lng} </i>`
        )
        .openPopup();

      this.#selectedCoords = { lat, lon: lng };
    });
  }

  #setupCamera() {
    console.log(this.#camera);
    if (this.#camera) {
      return;
    } else {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }
    console.log(this.#camera);

    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const image = await this.#camera.takePicture();
      // console.log(image)
      alert(URL.createObjectURL(image));
      await this.#addTakenPicture(image);
    });
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, "image/png");
    }

    const newStoryCam = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
    this.#takenPhoto = newStoryCam.blob;

    const canvas = document.getElementById("camera-canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);
    };
    img.src = URL.createObjectURL(blob);
    canvas.style.display = "block";
  }

  addSuccess(message) {
    alert(message);
    location.hash = '/'
  }

  addFailed(message) {
    alert(message);
  }
}
