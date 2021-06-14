<template>
  <div class="admin-post-pre">
    <div class="admin-post-pre-head row">
      <div class="column">
        <div class="row">
          <div class="column">
            <img
              :src="
                require('@/assets/images/' +
                  post.headerContent[1].writerImage +
                  '.png')
              "
              loading="lazy"
              :alt="
                'ez egy kis kép ' + post.headerContent[0].writerName + '-ról'
              "
            />
          </div>

          <div class="column align-center">
            <p>
              <strong>{{ post.headerContent[0].writerName }}</strong>
              - {{ post.headerContent[3].subRole }}
            </p>
            <p class="black-font">{{ post.headerContent[2].role }}</p>
          </div>
        </div>
      </div>
      <div class="column">
        <p class="black-font">{{ post.date }}</p>
      </div>
    </div>
    <div class="admin-post-pre__maintitle">
      {{ post.blogTitle }}
    </div>
    <p class="admin-post-pre__paragraph">
      {{post.blogShortContent | truncate(350)}}
    </p>
  </div>
</template>

<script>
export default {
  //A props egy módja (a data mellett) vue-ban annak, hogy tárolunk változókat
  //props (property) esetében adatot adunk át a "child" komponenseknek a "parent" komponensektől. Lényegében a props-ok HTML attribútumok.(read-only - nem változtathatóak)
  props: {
    post: Object,
  },
  //A FILTERS-en belüli metódussal/metódusokkal tudunk szövegeket formázni
  filters: {
    //truncate a metódus neve, aminek ebben az esetben két paramétere van (a "string" maga az adott szöveg amin alkalmazon a filtert, a "value" pedig az a karakterszám amit megadok maximumnak.)
    truncate(string, value) {
      //if elágazással megvizsgálom hogy maga a szöveg egyáltalán létezik-e illetve a szöveg hossza kisebb egyenlő-e a paraméterként megadott számmal, ha igen visszatér a szöveggel.
      if (string && string.length <= value) return string;
      //Ha a fenti "if" elágazásban foglaltak nem teljesülnek akkor hajtódik végre ez a sor: itt azt mondjuk, hogy visszatér a szöveg értékével amit a "substring" metódus paramétereivel meghatározunk (0-karaktertől indítunk a megadott számig) majd hozzáfűzzük a "..."
      return (string || "").substring(0, value) + "...";
    },
  },
};
</script>

<style lang="scss">
.admin-post-pre-head {
  justify-content: space-between;
  margin-bottom: 20px;
  p {
    font-size: 14px;
    font-family: SourceSansPro;
    margin-left: 12px;
    margin-bottom: 5px;
    color: #aa8961;
    &.black-font {
      color: #323232;
      margin-bottom: 0;
    }
  }
  img {
    border-radius: 50%;
  }
}
.admin-post-pre {
  padding: 0 20px 20px 20px;
  cursor: pointer;

  &__maintitle {
    font-size: 26px;
    text-decoration: none;
    font-family: SourceSanspro;
    color: #aa8961;
    font-weight: 700;
    margin-bottom: 20px;
    &:hover {
      color: #323232;
    }
  }

  &__paragraph {
    font-size: 18px;
    color: #323232;
    margin: 0 0 20px;
    line-height: 1.4;
    font-family: SourceSansPro;
    padding-bottom: 30px;
    border-bottom: 1px solid #d6d6d6;
    a {
      font-size: 18px;
    }
  }
}
</style>