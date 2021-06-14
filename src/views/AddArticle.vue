<template>
  <div>
    <admin-popup
      popupMessage="Nem töltött ki minden mezőt, kérem ellenőrizze!"
      v-if="emptyFieldPopup"
    >
      <admin-button
        slot="popupBtn"
        type="button"
        label="Rendben!"
        @click.native="hidePopup"
      ></admin-button>
    </admin-popup>

    <div class="success-msg" v-if="successSend">
      <h2>{{ successSendMessage }}</h2>
    </div>

    <div class="row admin-container">
      <div class="width-full add-article-block">
        <form method="post" @submit.prevent="saveFile" novalidate="true">
          <div class="row">
            <div class="form-group form-group--small">
              <select
                @input="clickedOnSelect"
                @blur="removeLabelPropForSelect"
                v-model="article.headerContent[0].writerName"
                :class="{ error: classes.isError }"
              >
                <option value="" selected disabled hidden>
                  Válassza ki a cikk íróját!
                </option>
                <option
                  v-for="option in existWriters"
                  :key="option.id"
                  :value="option.name"
                >
                  {{ option.name }}
                </option>
              </select>
              <span v-if="required">Kötelező mező!</span>
            </div>

            <admin-input
              ref="blogTitleInput"
              type="text"
              name="blogTitleInput"
              id="blogTitleInput"
              v-model="article.blogTitle"
              inputLabel="Blog főcíme:"
              :wordCounter="150"
            />
          </div>

          <admin-input
            ref="blogShortTitleInput"
            type="text"
            name="blogShortTitleInput"
            id="blogShortTitleInput"
            v-model="article.blogShortContent"
            inputLabel="Blog rövid leírása:"
            :wordCounter="600"
          />

          <quill-editor
            ref="myQuillEditor"
            v-model="article.blogContent"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          />

          <quill-editor
            v-model="article.blogCarouselImage"
            :options="editorOptionForImages"
          />
          <div class="admin-fixed-btns">
            <admin-button
              v-if="isUploadBtn !== true"
              type="submit"
              label="Mentem"
            ></admin-button>
            <admin-button
              v-if="isUploadBtn === true"
              type="submit"
              label="Mentem a változtatásokat!"
            ></admin-button>
          </div>
        </form>
      </div>
      <div class="column width-full">
        <div class="preview-wrapper">
          <div class="short-preview">
            <div v-if="writerImage" class="actual-writer-component">
              <img
                :src="require('@/assets/images/' + writerImage + '.png')"
                alt="A cikk írója"
              />
              <div class="column">
                <p class="article-writer">
                  <strong>{{ article.headerContent[0].writerName }}</strong>
                  - {{ writerTitle }}
                </p>
                <p>{{ writersubRole }}</p>
              </div>
              <p class="article-date">{{ article.date }}</p>
            </div>
            <div v-if="article.blogTitle" class="short-preview-maintitle">
              {{ article.blogTitle }}
            </div>
            <br />
            <div
              v-if="article.blogShortContent"
              class="short-preview-short-content"
            >
              {{ article.blogShortContent | truncate(350) }}
              <span v-if="article.blogContent" class="goto-article"
                >Bővebben</span
              >
            </div>
          </div>

          <div class="preview-outer">
            <div v-if="writerImage" class="actual-writer-component">
              <img
                :src="require('@/assets/images/' + writerImage + '.png')"
                alt="A cikk írója"
                class="writer-image"
              />
              <div class="column">
                <p class="article-writer">
                  <strong>{{ article.headerContent[0].writerName }}</strong>
                  - {{ writerTitle }}
                </p>
                <p>{{ writersubRole }}</p>
              </div>
              <p class="article-date">{{ article.date }}</p>
            </div>
            <div v-if="article.blogTitle" class="preview-maintitle">
              {{ article.blogTitle }}
            </div>
            <br />
            <div v-if="article.blogSubTitle" class="preview-subtitle">
              <strong>{{ article.blogSubTitle }}</strong>
            </div>
            <br />
            <div v-if="article.blogShortContent" class="preview-short-content">
              {{ article.blogShortContent }}
            </div>
            <br />
            <div
              class="preview-full-content"
              v-if="article.blogContent"
              v-html="article.blogContent"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//Importálni kívánt komponensek
import AdminButton from "../components/AdminButton";
import AdminInput from "../components/AdminInput";
import AdminPopup from "../components/AdminPopup";
import axios from "axios";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    AdminButton,
    AdminInput,
    AdminPopup,
    quillEditor,
  },
  //data függvény ami "adatobjektumot" ad vissza az adott komponensnek.
  data() {
    return {
      editorOption: {
        placeholder: 'Adja meg a cikk tartalmát:',
      },
      editorOptionForImages: {
        modules: {
          toolbar: {
            container: [["image"]],
          },
        },
        placeholder: 'Adjon hozzá egy előnézeti képet:',
      },
      wordCounter: 10,
      required: false,
      isRequiredText: null,
      emptyFieldPopup: false,
      successSend: false,
      successSendMessage: "",
      classes: {
        isError: false,
      },
      article: {
        headerContent: [
          { type: "text", writerName: "" },
          { type: "image", writerImage: "" },
          { type: "text", role: "" },
          { type: "text", subRole: "" },
        ],
        date: this.customizedTheDate(),
        blogTitle: "",
        blogShortContent: "",
        blogCarouselImage: "",
        blogContent: "",
      },
      existWriters: [],
      writerTitle: "",
      writersubRole: "",
      writerImage: "",
      isUploadBtn: false,
    };
  },
  //filter metódus szövegek/adatok formázására, módosítására
  filters: {
    //filter függvény neve két paraméterrel (string - ahol ez a függvényt használom annak a szöveges tartalma a string, value - amit megadok a késsőbbiekben érték (numerikus!))
    truncate(string, value) {
      //Ha a szöveg ÉS (logikai operátor &&) a szöveg hossza kisebb egyenlő mint a megadott szám, akkor simán a "teljes" szöveggel tér vissza.
      if (string && string.length <= value) return string;
      //Ha viszont hosszabb akkor csak anniy karakterrel tér vissza amenniyt paraméterként meghatároztunk és még hozzáfűzi a ""..." is.
      return (string || "").substring(0, value) + "...";
    },
  },
  methods: {
    //VUE Quill editor függvényei, opcionálosak
    onEditorBlur(quill) {
      console.log("editor blur!", quill);
    },
    onEditorFocus(quill) {
      console.log("editor focus!", quill);
    },
    onEditorReady(quill) {
      console.log("editor ready!", quill);
    },
    onEditorChange({ quill, html, text }) {
      console.log("editor change!", quill, html, text);
      this.content = html;
    },
    //appendLeadingZeroes függvény a dátum formázására, ha a hónap és a nap nem kétszámjegyű ezzel a függvénnyel elé teszünk egy nullát (pl: 3.12 -> .03.12)
    appendLeadingZeroes(n) {
      if (n <= 9) {
        return "0" + n;
      }
      return n;
    },
    //Dátum megadása az article.date-nek, customizedTheDate fügvénnyel
    customizedTheDate() {
      //aktuális dátum
      let currentDate = new Date();
      //aktuális dátum formázva igény szerint - év.hónap.nap
      let formatDate =
        currentDate.getFullYear() +
        "." +
        this.appendLeadingZeroes(currentDate.getMonth() + 1) +
        "." +
        this.appendLeadingZeroes(currentDate.getDate());
      return formatDate;
    },
    //hidePopup függvény a felugró pop-up eltüntetésére, amit egy click eseményhez adunk hozzá
    hidePopup() {
      //"adatobjektum" boolean értékének megváltoztatása
      this.emptyFieldPopup = false;
    },
    //Felvitt cikk rögzítésének függvénye
    saveFile(event) {
      //Letiltjuk a böngésző alapértelmezett működést (submit), mivel axios.post-al küldjük az adatokat
      event.preventDefault();
      //Megvizsgálom hogy az oldalnak mi a route "neve", ha nem a cikk-szerkesztese, akkor csak küldi az új adatokat POST metódussal.
      if (this.$route.name !== "EditArticle") {
        this.isUploadBtn = false;
        var subTitleValue = this.article.blogTitle;
        var subtitleLowercase = subTitleValue.toLowerCase();
        var replacedSubtitle = subtitleLowercase.replace(/ /g, "-");
        this.article.id = replacedSubtitle;

        var carouselImage = this.article.blogCarouselImage;
        carouselImage = carouselImage.replace(/<p>/g, "");
        carouselImage = carouselImage.replace(/<\/p>/g, "");
        this.article.blogCarouselImage = carouselImage; 

        if (
          this.article.headerContent[0].writerName === "" ||
          this.article.blogTitle === "" ||
          this.article.blogContent === ""
        ) {
          this.emptyFieldPopup = true;
        } else {
          axios
            .post("http://localhost:3001/articles", this.article)
            .then(({ data }) => {
              this.article.headerContent[0].writerName = "";
              this.writerImage = "";
              this.writerTitle = "";
              this.writersubRole = "";
              this.article.blogTitle = "";
              this.article.blogShortContent = "";
              this.article.blogCarouselImage = "";
              this.article.blogContent = "";

              this.successSend = true;
              this.successSendMessage =
                "A cikk rögzítése sikeresen megtörtént!";
            });
        }
        //Ha a cikk szerkesztése a route neve, akkor szerkesztem a meglévő adatokat PUT metódussal.
      } else {
        //Cikk szerkesztése gomb megjelenítése, a cikk hozzáadása helyett
        this.isUploadBtn = true;
        //Dátum felülírása
        this.article.date = this.customizedTheDate();
        //carousel image tag kinyerése a szövegszerkesztőből
        var carouselImageForUpload = this.article.blogCarouselImage;
        carouselImageForUpload = carouselImageForUpload.replace(/<p>/g, "");
        carouselImageForUpload = carouselImageForUpload.replace(/<\/p>/g, "");
        this.article.blogCarouselImage = carouselImageForUpload;
        
        //axios PUT metódus a létező cikk felülírásához (két paramétere van az útvonal és a tartalom)
        axios
          .put(
            "http://localhost:3001/articles/" + this.article.id,
            this.article
          )
          //Ha sikeres, üzenet jelenik meg a felhasználónak
          .then((resp) => {
            this.successSend = true;
            this.successSendMessage =
              "A cikk szerkesztése sikeresen megtörtént!";
          });
      }
    },
    //validáció a select mezőnek
    removeLabelPropForSelect($event) {
      //ha nincs értéke, akkor megkapja az error css class-t és a required true lesz
      if (
        $event.target.value === "" ||
        $event.target.value === null ||
        $event.target.value === "undefined"
      ) {
        this.required = true;
        this.classes.isError = true;
      //ha van értéke, akkor "lekerül" az error css class és a required
      } else {
        this.required = false;
        this.classes.isError = false;
      }
    },
    //clickedOnSelect függvény a select mező adatainak betöltésére, illetve a kiválasztott adatok megjelenítésére egy paramétere az esemény objektum.
    clickedOnSelect($event) {
      //for ciklussal végig iterálok az existWriters tömbön.
      for (var i = 0; i < this.existWriters.length; i++) {
      //for ciklussal végig iterálok az existWriters tömbön, mit lentebb töltök fel tartalommal. Ha a kattintáskor egyező value azonos az aktuális cikkíró nevével akkor...
        if (this.existWriters[i].name === $event.target.value) {
          //... betöltöm az aktuális "adatobjektumokba" a tartalmat
          this.writerTitle = this.existWriters[i].role;
          this.writersubRole = this.existWriters[i].subRole;
          this.writerImage = this.existWriters[i].userImg;
          this.article.headerContent[1].writerImage = this.existWriters[
            i
          ].userImg;
          this.article.headerContent[2].role = this.existWriters[i].role;
          this.article.headerContent[3].subRole = this.existWriters[i].subRole;
        }
      }
      //Ha belekattintanak a select mezőbe de nem választanak ki értéket, akkor error stilizálsát kap a mező.
      if (
        $event.target.value === "" ||
        $event.target.value === null ||
        $event.target.value === "undefined"
      ) {
        this.required = true;
      } else {
        this.required = false;
        this.classes.isError = false;
      }
    },
    //calculateTheActualPreviewBoxsHeight függvény (kiszámolja az aktuális "ablak" magasságot)
    calculateTheActualBoxHeights() {
      //aktuális "ablak" magassága
      let windowHeight = window.innerHeight;
      //A header magassága + 80px
      let headerheight = document.querySelector(".header").offsetHeight + 80;
      //beállítom a bal oldali rövid előnézeti blokknak a kért magasságot
      document.querySelector(".preview-wrapper").style.height =
        windowHeight - headerheight + "px";
        //beállítom a jobb oldali teljes előnézeti blokknak a kért magasságot
      document.querySelector(".add-article-block").style.height =
        windowHeight - headerheight + "px";
    },
  },
  //mounted (lifecycle hook), akkor hívódik meg amikor az adott komponens hozzáadódik a DOM-hoz. (DOM = A dokumentum tartalmát, illetve a dokumentum valamennyi összetevőjét magában foglalja lényegében ez az oldal teljes HTML)
  mounted() {
    //calculateTheActualBoxHeights függvény ami beállítja a jobb és bal oldlai boxok magasságát
    this.calculateTheActualBoxHeights();
    //itt töltöm fel az "existWriters" üres tömböt a létező cikkírókkal.
    axios.get("http://localhost:3001/users").then((resp) => {
      this.existWriters = resp.data;
    });
    //Ha az url/route neve a cikk-szerkesztes, akkor az aktuális adatokat töltse a select mezőbe és a preview-ba is.
    if (this.$route.name === "EditArticle") {
      //Szerkesztés gomb megjelenítése a hozzáadás helyett
      this.isUploadBtn = true;
      //axios get HTTP kérés, lekérdezzük a végpontról az adott "id"-jű cikket és feltöltjük az adott adatobjektumba az értékét.
      axios
        .get(`http://localhost:3001/articles/${this.$route.params.id}`)
        .then((resp) => {
          this.article = resp.data;
          this.writerImage = this.article.headerContent[1].writerImage;
          this.writerTitle = this.article.headerContent[2].role;
          this.writersubRole = this.article.headerContent[3].subRole;
        });
    }
  },
  //komplexebb logika esetén használjuk a vue "computed" tulajdonságát -> computed properties
  computed: {
    editor() {
      this.$refs.myQuillEditor.quill.root.setAttribute(
        "data-placeholder",
        "Kezdjen gépelni"
      );
      return this.$refs.myQuillEditor.quill;
    },
  },
};
</script>

<style lang="scss">
.add-article-block {
  overflow-y: auto;
  padding-right: 15px;
  .ql-container {
    height: 100%;
  }
  .quill-editor {
    margin-bottom: 30px;
  }
}
@import "@/assets/styles/app.scss";
</style>