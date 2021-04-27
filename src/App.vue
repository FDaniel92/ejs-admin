<template>
  <div id="admin">
    <admin-popup
      popupMessage="Nem töltött ki minden mezőt, kérem ellenőrizze!"
      popupBtnValue="Rendben"
      v-if="activateThePopUp"
    >
      <admin-button
        slot="popupBtn"
        type="button"
        label="Rendben!"
        @click.native="hidePopup"
      ></admin-button>
    </admin-popup>

    <admin-header></admin-header>

    <div class="row admin-container">
      <div>
        <form method="post" @submit.prevent="saveFile" novalidate="true">
          <div class="form-group">
            <select
              @input="clicked"
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
          />

          <admin-input
            ref="blogShortTitleInput"
            type="text"
            name="blogShortTitleInput"
            id="blogShortTitleInput"
            v-model="article.blogShortTitle"
            inputLabel="Blog rövid leírása:"
          />

          <!-- <div class="blog-content-container">
          <div
            v-for="(blogArticle, counter) in article.blogContents"
            :key="counter"
          >
            <admin-textarea
              v-model="blogArticle.body"
              inputLabel="Blog cikk szövege"
              v-if="blogArticle.type === 'text'"
            ></admin-textarea>

            <admin-image-area
              v-model="article.blogContents[counter]"
              inputLabel="Kép neve"
              inputAltLabel="Kép alt címe"
              isCarouselText="Előnézeti kép?"
              v-if="blogArticle.type === 'image'"
            />
          </div>
        </div> -->
          <quill-editor
            ref="myQuillEditor"
            v-model="article.blogContent"
            :options="editorOption"
            @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)"
          />
          <div class="admin-fixed-btns">
            <!-- <div class="add-article-btn" @click="addNewArticleInput('text')">
            Blog cikk hozzáadása
          </div>
          <p class="required-textarea">
            {{ isRequiredText }}
          </p>
          <div class="add-image-btn" @click="addNewArticleInput('image')">
            Kép hozzáadása
          </div> -->
            <admin-button type="submit" label="Mentem"></admin-button>
          </div>
        </form>
      </div>
      <div class="preview">
        <div v-if="writerImage" class="actual-writer-component">
          <img
            :src="require('@/assets/images/' + writerImage + '.png')"
            alt="A cikk írója"
          />
          <div class="column">
            <p>
              <strong>{{ article.headerContent[0].writerName }}</strong>
              - {{ writerTitle }}
            </p>
            <p>{{ writersubRole }}</p>
          </div>
          <p>{{ article.date }}</p>
        </div>
        <div v-if="article.blogTitle" class="preview-maintitle">{{ article.blogTitle }}</div>
        <br />
        <br />
        <br />
        <div v-if="article.blogShortTitle" class="preview-short-content"> {{ article.blogShortTitle }}</div>
        <br />
        <br />
        <div
          v-if="article.blogContent"
          v-html="article.blogContent"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import AdminHeader from "./components/AdminHeader";
import AdminButton from "./components/AdminButton";
import AdminInput from "./components/AdminInput";
// import AdminTextarea from "./components/AdminTextarea";
// import AdminImageArea from "./components/AdminImageArea";
import AdminPopup from "./components/AdminPopup";
import axios from "axios";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

export default {
  name: "App",
  components: {
    AdminHeader,
    AdminButton,
    AdminInput,
    AdminPopup,
    quillEditor,
  },
  data() {
    return {
      editorOption: {
        // Some Quill options...
      },
      required: false,
      isRequiredText: null,
      activateThePopUp: false,
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
        date: new Date().toISOString().split("T")[0],
        blogTitle: "",
        blogShortTitle: "",
        blogContent: "",
      },
      existWriters: [],
      writerTitle: "",
      writersubRole: "",
      writerImage: "",
      actualIndex: 0,
      actualIndexForImages: 0,
      finallySend: false,
    };
  },
  methods: {
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
    addNewArticleInput(type) {
      if (type === "text") {
        if (this.article.blogContents[this.actualIndex].body !== "") {
          this.actualIndex++;
          this.isRequiredText = "";
          this.article.blogContents.push({
            type: type,
            body: "",
          });
        } else if (this.actualIndex >= 1) {
          this.isRequiredText = "Minden cikk mezőt töltsön ki!";
        } else {
          this.isRequiredText = "Legalább egy cikket adjon hozzá!";
        }
      } else {
        this.article.blogContents.push({
          type: type,
          imageName: "",
          imageAlt: "",
          isCarousel: false,
        });
        this.actualIndexForImages++;
      }
      window.scrollTo(0, document.body.scrollHeight);
    },
    hidePopup() {
      this.activateThePopUp = false;
    },
    saveFile(event) {
      event.preventDefault();

      var subTitleValue = this.article.blogTitle;
      var subtitleLowercase = subTitleValue.toLowerCase();
      var replacedSubtitle = subtitleLowercase.replace(/ /g, "-");
      this.article.id = replacedSubtitle;

      for (const [key, value] of Object.entries(this.article)) {
        if (
          `${value}` === "" ||
          `${value}` === null ||
          this.article.headerContent[0].writerName === "" ||
          this.article.blogContent === ""
        ) {
          this.activateThePopUp = true;
        } else {
          axios
            .post("http://localhost:3001/articles", this.article)
            .then(({ data }) => {
              for (let key in this.article) this.article[key] = null;
              window.location.reload();
            });
        }
      }
    },
    removeLabelPropForSelect($event) {
      if (
        $event.target.value === "" ||
        $event.target.value === null ||
        $event.target.value === "undefined"
      ) {
        this.required = true;
        this.classes.isError = true;
      } else {
        this.required = false;
        this.classes.isError = false;
      }
    },
    clicked($event) {
      this.$emit("input", $event.target.value);
      for (var i = 0; i < this.existWriters.length; i++) {
        if (this.existWriters[i].name === $event.target.value) {
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
  },
  mounted() {
    axios.get("http://localhost:3001/users").then((resp) => {
      this.existWriters = resp.data;
    });

    console.log("this is current quill instance object", this.editor);
  },
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
@import "@/assets/styles/app.scss";
</style>
