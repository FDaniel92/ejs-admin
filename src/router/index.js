//Modulok (és Main komponens) importálása
import Vue from "vue";
import VueRouter from 'vue-router';
import Main from "../views/Main.vue"

Vue.use(VueRouter);
//Útvonalak megadása a VUE router segítségével, egy tömbben definiáljuk a route komponenseket
const routes = [
    {
        path: "/",
        name: "Home",
        component: Main
    },
    {
        path: "/cikk-felvetele",
        name: "AddArticle",
        component: () =>
            import("../views/AddArticle.vue")
    },
    {
        path: "/cikkek-megtekintese",
        name: "PreviewArticles",
        component: () =>
            import("../views/PreviewArticles.vue")
    },
    {
        path: "/cikk-szerkesztese/:id",
        name: "EditArticle",
        component: () =>
            import("../views/AddArticle.vue")
    }
]
//Létrehozzuk a "router" példányt (példány =  valamilyen objektum konkrét megvalósulása) és átadjuk neki a korábban létrehozott konstanst (routes).
const router = new VueRouter({
    //a "mode:history" felel azért, hogy ne kelljen az egész odlalt újra betölteni ha az URL változik
    mode: "history",
    //Útvonalak
    routes
})
//export default utasítás felel azért, hogy a modulunkat máshol is tudjuk használni (import router from "router" - main.js)
export default router;