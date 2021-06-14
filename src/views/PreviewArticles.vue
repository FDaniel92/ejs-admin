<template>
  <div class="preview-articles row">
    <admin-popup
      popupMessage="Biztos benne hogy törli a cikket?"
      v-if="deleteArticlePopup"
    >
      <admin-button
        slot="popupBtn"
        type="button"
        label="Igen, törlöm!"
        @click.native="deleteArticleData(articleInfo.id)"
      ></admin-button>
      <admin-button
        slot="popupBtn"
        type="button"
        label="Mégsem"
        @click.native="deleteArticleDataPopup(false)"
      ></admin-button>
    </admin-popup>
    <div class="preview-exist-articles column">
      <admin-article-post-pre
        v-for="(post, index) in existArticles"
        :post="post"
        :key="index"
        @click.native="showFullArticle(post.id)"
      >
      </admin-article-post-pre>
    </div>

    <div
      class="admin-article-post-full-wrapper"
      :class="{ emptyFieldFill: !articleInfo }"
    >
      <h2 v-if="!articleInfo">Válasszon ki egy cikket!</h2>
      <div v-if="articleInfo" class="admin-article-post-full">
        <div class="row editing-post">
          <div class="delete-article" @click="deleteArticleDataPopup(true)">
            <img
              class="delete-article-icon"
              src="~@/assets/images/delete.svg"
              alt="delete article"
            />
          </div>
          <router-link
            class="edit-article"
            :to="`/cikk-szerkesztese/${articleInfo.id}`"
            ><img
              class="edit-article-icon"
              src="~@/assets/images/edit.svg"
              alt="edit article"
          /></router-link>
        </div>
        <div class="actual-writer-component">
          <img
            :src="
              require('@/assets/images/' +
                articleInfo.headerContent[1].writerImage +
                '.png')
            "
            alt="A cikk írója"
            class="writer-image"
          />
          <div class="column">
            <p class="article-writer">
              <strong>{{ articleInfo.headerContent[0].writerName }}</strong>
              - {{ articleInfo.headerContent[2].role }}
            </p>
            <p>{{ articleInfo.headerContent[3].subRole }}</p>
          </div>
          <p class="article-date">{{ articleInfo.date }}</p>
        </div>
        <div v-if="articleInfo.blogTitle" class="preview-maintitle">
          {{ articleInfo.blogTitle }}
        </div>
        <br />
        <div v-if="articleInfo.blogShortContent" class="preview-short-content">
          {{ articleInfo.blogShortContent }}
        </div>
        <br />
        <div
          class="preview-full-content"
          v-if="articleInfo.blogContent"
          v-html="articleInfo.blogContent"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
//Komponens importálása, hogy használhassuk a jelenlegi file-ban
import AdminArticlePostPre from "../components/AdminArticlePostPre.vue";
import AdminPopup from "../components/AdminPopup.vue";
import AdminButton from "../components/AdminButton.vue";
import axios from "axios";
export default {
  components: {
    AdminArticlePostPre,
    AdminButton,
    AdminPopup,
  },
  //data függvény ami "adatobjektumot" ad vissza az adott komponensnek. Mivel a "data" privát, csak komponensen belül működik!
  data() {
    return {
      existArticles: [],
      articleInfo: null,
      deleteArticlePopup: false,
    };
  },
  //Metódusok (Olyan alprogram, amely egy objektumon belül van deklarálva, az objektum működéséhez kapcsolódik.)
  methods: {
    //deleteArticleDataPopup függvény egy paraméterrel (a paraméter értéke egy boolean változó)
    deleteArticleDataPopup(condition) {
      //deleteArticlePopup "adatobjektumnak" adok értéket, amit a paraméterből kap meg.
      this.deleteArticlePopup = condition;
    },
    //deleteArticleData függvény egy paraméterrel (a paraméter értéke az adott cikk id-ja lesz)
    deleteArticleData(articleDeleteId) {
      //axios delete függvény, ami egy adott URL-re hajt végre egy HTTP DELETE kérést.
      axios
        .delete("http://localhost:3001/articles/" + articleDeleteId)
        //Ha a HTTP DELETE kérés sikeresen végbement, akkor fut le a "then"
        .then((resp) => {
          //fetchArticles függvény hívása
          this.fetchArticles();
          //Előnézet "le nullázása", ez a törölt elemet.
          this.articleInfo = null;
        });
      //"Biztos törli" pop-up eltüntetése.
      this.deleteArticlePopup = false;
    },
    //fetchArticles függvény
    fetchArticles() {
      //fetch metódussal lekérem az articles JSON file tartalmát
      fetch("http://localhost:3001/articles")
        //Ha sikeres a lekérés akkor egy JSON objektummal tér vissza
        .then((response) => response.json())
        .then((json) => {
          //Ha sikeres a lekérés akkor feltöltöm a existArticles a bejövő JSON adattal.
          this.existArticles = json;
        });
    },
    //showFullArticle függvény egy paraméterrel
    showFullArticle(articleId) {
      //for ciklus ami az articles.json objektumain "fut át", annyiszor ahány adatobjektuma van.
      for (const article of this.existArticles) {
        //Ha az adott id megegyezik a for ciluson belülivel akkor...
        if (article.id == articleId) {
        //... betölti az adatokat az "articleInfo"-ba
          this.articleInfo = article;
        }
      }
    },
    //calculateTheActualPreviewBoxsHeight függvény (kiszámolja az aktuális "ablak" magasságot)
    calculateTheActualPreviewBoxsHeight() {
      //aktuális "ablak" magassága
      let windowHeight = window.innerHeight;
      //A header magassága + 80px
      let headerheight = document.querySelector(".header").offsetHeight + 80;
      //beállítom a bal oldali rövid előnézeti blokknak a kért magasságot
      document.querySelector(".preview-exist-articles").style.height =
        windowHeight - headerheight + "px";
      //beállítom a jobb oldali teljes előnézeti blokknak a kért magasságot
      document.querySelector(".admin-article-post-full-wrapper").style.height =
        windowHeight - headerheight + "px";
    },
  },
  //created (lifecycle hook) - "futás közbeni kód hozzáadást tesz lehetővé", ebben a szakaszban még nincs DOM manipuláció.
  created() {
    this.fetchArticles();
  },
  //mounted (lifecycle hook), akkor hívódik meg amikor az adott komponens hozzáadódik a DOM-hoz. (DOM = A dokumentum tartalmát, illetve a dokumentum valamennyi összetevőjét magában foglalja lényegében ez az oldal teljes HTML)
  mounted() {
    //calculateTheActualPreviewBoxsHeight függvény meghívása
    this.calculateTheActualPreviewBoxsHeight();
  }
};
</script>

<style lang="scss">
.preview-articles {
  padding: 0 20px;
  position: relative;
  .preview-exist-articles {
    width: 60%;
    height: 700px;
    overflow-y: auto;
    margin-right: 20px;
  }
  .admin-article-post-full-wrapper {
    &.emptyFieldFill {
      background-image: linear-gradient(
        45deg,
        #c9d8e0 25%,
        #ffffff 25%,
        #ffffff 50%,
        #c9d8e0 50%,
        #c9d8e0 75%,
        #ffffff 75%,
        #ffffff 100%
      );
      background-size: 14.14px 14.14px;
      background-size: 14.14px 14.14px;
    }
    width: 100%;
    height: 700px;
    overflow-y: auto;
    border: 1px solid #d6d6d6;
    border-radius: 4px;
    position: relative;
    .editing-post {
      justify-content: flex-end;
      .delete-article {
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        margin-right: 20px;
        transition: 0.25s ease-in-out;
        position: relative;
        &:before {
          content: "Törlés";
          font-family: SourceSansPro;
          font-size: 12.5px;
          color: white;
          position: absolute;
          padding: 6px 8px;
          background: #1e1e1e;
          top: -20px;
          left: -40px;
          border-radius: 4px;
          opacity: 0;
          transition: 0.25s ease-in-out;
        }
        &:hover {
          background: #d6d6d6;
        }
        &:hover::before {
          opacity: 1;
        }
      }
      .edit-article {
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        transition: 0.25s ease-in-out;
        position: relative;
        &:before {
          content: "Szerkesztés";
          font-family: SourceSansPro;
          font-size: 12.5px;
          font-weight: 100;
          color: white;
          position: absolute;
          padding: 6px 8px;
          background: #1e1e1e;
          top: -20px;
          right: -10px;
          border-radius: 4px;
          opacity: 0;
          transition: 0.25s ease-in-out;
        }
        &:hover {
          background: #d6d6d6;
        }
        &:hover::before {
          opacity: 1;
        }
      }
      img {
        width: 20px;
        height: 20px;
        margin: 0;
      }
    }
    h2 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-family: SourceSansPro;
      font-weight: 700;
      font-size: 40px;
      color: #323232;
    }
    .admin-article-post-full {
      padding: 20px;
      a {
        color: #aa8961;
        font-weight: bold;
        &:hover {
          background: #aa8961;
          color: black;
        }
      }
      img:not(.writer-image):not(.delete-article-icon) {
        display: block;
        width: 100%;
        margin: 30px 0;
      }
      .preview-maintitle {
        font-family: PlayFairDisplay;
        font-size: 40px;
        color: #aa8961;
        font-weight: 700;
        line-height: 1.1;
      }
      .preview-subtitle {
        font-size: 26px;
        font-weight: 700;
        margin: 25px 0 40px 0;
        font-family: SourceSanspro;
      }
      .preview-short-content {
        font-size: 26px;
        line-height: 1.4;
        font-family: SourceSansPro;
      }

      .preview-full-content {
        p {
          font-size: 20px;
          margin: 25px 0;
          color: #323232;
          line-height: 1.4;
          font-family: SourceSansPro;
        }
      }
    }
  }
}
</style>