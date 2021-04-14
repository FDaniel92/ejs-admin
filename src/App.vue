<template>
  <div id="admin">
    <admin-header></admin-header>
    <div class="container">
      <form
        method="post"
        @submit.prevent="saveFile"
        enctype="multipart/form-data"
      >
        <div class="form-group">
          <select
            @input="clicked"
            v-model="article.headerContent[0].writerName"
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
        </div>

        <div v-if="writerImage" class="actual-writer-component">
          <img
            :src="require('@/assets/images/' + writerImage + '.png')"
            alt="A cikk írója"
          />
          <p>
            <strong>A Cikk írója:</strong>
            {{ article.headerContent[0].writerName }}
          </p>
          <p><strong>Titulus:</strong> {{ writerTitle }}</p>
          <p><strong>Altitulus:</strong> {{ writersubRole }}</p>
        </div>

        <admin-input
          ref="blogTitleInput"
          type="text"
          name="blogTitleInput"
          id="blogTitleInput"
          v-model="article.blogTitle"
          inputLabel="Blog főcíme:"
        />

        <div class="blog-content-container">
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
        </div>

        <div class="fixed-btns">
          <div class="add-article-btn" @click="addNewArticleInput('text')">
            Blog cikk hozzáadása
          </div>
          <div class="add-image-btn" @click="addNewArticleInput('image')">
            Kép hozzáadása
          </div>
          <admin-button type="submit" label="Mentem"></admin-button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AdminHeader from "./components/AdminHeader";
import AdminButton from "./components/AdminButton";
import AdminInput from "./components/AdminInput";
import AdminTextarea from "./components/AdminTextarea";
import AdminImageArea from "./components/AdminImageArea";
import axios from "axios";

export default {
  name: "App",
  components: {
    AdminHeader,
    AdminButton,
    AdminInput,
    AdminTextarea,
    AdminImageArea,
  },
  data() {
    return {
      article: {
        headerContent: [
          { type: "text", writerName: "" },
          { type: "image", writerImage: "" },
          { type: "text", role: "" },
          { type: "text", subRole: "" },
        ],
        date: new Date().toISOString().split("T")[0],
        blogTitle: "",
        blogContents: [
          {
            type: "text",
            body: "",
          },
        ],
      },
      existWriters: [],
      writerTitle: "",
      writersubRole: "",
      writerImage: "",
    };
  },
  methods: {
    addNewArticleInput(type) {
      if (type === "text") {
        this.article.blogContents.push({
          type: type,
          body: "",
        });
      } else {
        this.article.blogContents.push({
          type: type,
          imageName: "",
          imageAlt: "",
          isCarousel: false,
        });
      }
      // window.scrollTo(0, document.body.scrollHeight);
      // console.log(document.body.scrollHeight);
    },
    saveFile(event) {
      event.preventDefault();

      var subTitleValue = this.article.blogTitle;
      var subtitleLowercase = subTitleValue.toLowerCase();
      var replacedSubtitle = subtitleLowercase.replace(/ /g, "-");
      this.article.id = replacedSubtitle;

      // axios
      //   .post("http://localhost:3001/articles", this.article)
      //   .then(({ data }) => {
      //     for (let key in this.article) this.article[key] = null;
      //     window.location.reload();
      //   });
      console.log(this.article);
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
    },
  },
  mounted() {
    axios.get("http://localhost:3001/users").then((resp) => {
      this.existWriters = resp.data;
    });
  },
};
</script>

<style lang="scss">
@import "@/assets/styles/app.scss";
</style>
