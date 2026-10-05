/* ===================================
   PUBLIC API EXPLORER
=================================== */


/* API ma'lumotlari */
let apiData = [];


/* Elementlarni olish */
const apiGrid = document.getElementById("apiGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const apiCount = document.getElementById("apiCount");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const retryButton = document.getElementById("retryButton");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");

const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalCategory = document.getElementById("modalCategory");
const modalHttps = document.getElementById("modalHttps");
const modalAuth = document.getElementById("modalAuth");
const modalLink = document.getElementById("modalLink");


/* ===================================
   API MA'LUMOTLARINI OLISH
=================================== */

async function loadAPIs() {

    loading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    apiGrid.innerHTML = "";

    try {

        const response = await fetch(
            "https://api.publicapis.org/entries"
        );

        if (!response.ok) {
            throw new Error("API xatosi");
        }

        const data = await response.json();

        apiData = data.entries;

        createCategories();

        displayAPIs(apiData);

    } catch (error) {

        console.error(error);

        loading.classList.add("hidden");
        errorMessage.classList.remove("hidden");

    }

}


/* ===================================
   KATEGORIYALARNI YARATISH
=================================== */

function createCategories() {

    const categories = [
        ...new Set(
            apiData.map(api => api.Category)
        )
    ].sort();

    categorySelect.innerHTML =
        '<option value="all">Barcha kategoriyalar</option>';

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categorySelect.appendChild(option);

    });

}


/* ===================================
   API LARNI CHIQARISH
=================================== */

function displayAPIs(apis) {

    loading.classList.add("hidden");

    apiGrid.innerHTML = "";

    apiCount.textContent = apis.length;

    if (apis.length === 0) {

        apiGrid.innerHTML = `
            <div class="error-message">
                <h3>API topilmadi</h3>
                <p>
                    Boshqa qidiruv so‘zini sinab ko‘ring.
                </p>
            </div>
        `;

        return;
    }


    /* Juda katta katalog bo‘lsa,
       dastlabki 100 ta ko‘rsatiladi */

    const limitedAPIs = apis.slice(0, 100);


    limitedAPIs.forEach((api, index) => {

        const card =
            document.createElement("article");

        card.className = "api-card";

        card.innerHTML = `

            <span class="api-category">
                ${escapeHTML(api.Category)}
            </span>

            <h3>
                ${escapeHTML(api.API)}
            </h3>

            <p>
                ${escapeHTML(api.Description)}
            </p>

            <div class="card-footer">

                <span class="status">
                    ● ${api.HTTPS ? "HTTPS mavjud" : "HTTPS yo‘q"}
                </span>

                <button
                    class="details-button"
                    data-index="${apiData.indexOf(api)}"
                >
                    Batafsil →
                </button>

            </div>

        `;

        apiGrid.appendChild(card);

    });


    /* Batafsil tugmalar */

    document
        .querySelectorAll(".details-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const index =
                        Number(button.dataset.index);

                    openModal(apiData[index]);

                }
            );

        });

}


/* ===================================
   QIDIRUV
=================================== */

function filterAPIs() {

    const searchValue =
        searchInput.value
            .toLowerCase()
            .trim();

    const category =
        categorySelect.value;


    const filtered =
        apiData.filter(api => {

            const matchesSearch =
                api.API
                    .toLowerCase()
                    .includes(searchValue) ||

                api.Description
                    .toLowerCase()
                    .includes(searchValue);


            const matchesCategory =
                category === "all" ||
                api.Category === category;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    displayAPIs(filtered);

}


searchInput.addEventListener(
    "input",
    filterAPIs
);

categorySelect.addEventListener(
    "change",
    filterAPIs
);


/* ===================================
   MODAL
=================================== */

function openModal(api) {

    if (!api) return;

    modalTitle.textContent =
        api.API;

    modalDescription.textContent =
        api.Description;

    modalCategory.textContent =
        api.Category;

    modalHttps.textContent =
        api.HTTPS
            ? "Ha"
            : "Yo‘q";

    modalAuth.textContent =
        api.Auth
            ? api.Auth
            : "Talab qilinmaydi";

    modalLink.href =
        api.Link;

    modal.classList.remove("hidden");

}


function closeModalWindow() {

    modal.classList.add("hidden");

}


closeModal.addEventListener(
    "click",
    closeModalWindow
);


modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {
            closeModalWindow();
        }

    }
);


/* ESC tugmasi */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeModalWindow();
        }

    }
);


/* ===================================
   XAVFSIZ MATN
=================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text || "";

    return div.innerHTML;

}


/* ===================================
   QAYTA URINISH
=================================== */

retryButton.addEventListener(
    "click",
    loadAPIs
);


/* ===================================
   ISHGA TUSHIRISH
=================================== */

loadAPIs();