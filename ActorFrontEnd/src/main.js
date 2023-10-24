const app = Vue.createApp({
    data() {
        return {
            message: "Hello World! from Vue.js",
            error: null,
        }
    },
    async created() {
        // created() is a life cycle method, not an ordinary method
        // created() is called automatically when the page is loaded
        console.log("created method called")
        //this.getPosts() //this is to get all posts from the start
    },
    methods: {
        
    },
})