const baseCarUrl = "https://anbo-restcarswithmanager.azurewebsites.net/api/cars"

app.component("car-api", {
    props: {},
    template: /*html*/ `
        <button
            class="button"
            id="get-all-button"
            v-on:click="getCars">
            Get list
        </button>
        <button
            class="button"
            id="clean-all-list"
            v-on:click="cleanList">
            Clean list
        </button>
        <form class="car-post">
            <h3>Make a car object</h3>
            <label for="model">Model:</label>
            <input id="model" v-model="model" type="text" />
            <label for="vendor">Vendor:</label>
            <input id="vendor" v-model="vendor" type="text" />
            <label for="price">Price:</label>
            <input id="price" v-model="price" type="number" />
            <input class="Button" type="button" value="Post" v-on:click="postCar" />
        </form>
        <ol v-if="cars.length > 0">
            <li v-for="car in cars">
                <h3>
                    Id: {{ car.id }}, Model: {{ car.model }}, Vendor: {{ car.vendor }}, Price: {{ car.price }}
                </h3>
            </li>
        </ol>
    `,
    data() {
        return {
            message: "Hello World! from Vue.js",
            cars: [],
            error: null,
            model: "",
            vendor: "",
            price: 0,
        }
    },
    methods: {
        cleanList() {
            this.cars = []
            this.error = null
        },
        async getCars() {
            try {
                const response = await axios.get(baseCarUrl)
                this.cars = await response.data
                this.error = null
            } catch (ex) {
                this.posts = []
                this.error = ex.Message;
            }
        },
        async postCar() {
            try {
                const car = {
                    model: this.model,
                    vendor: this.vendor,
                    price: parseInt(this.price),
                };
                const response = await axios.post(baseCarUrl, car, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                this.cars.push(await response.data);
                this.error = null;
            } catch (ex) {
                console.error('Error:', ex);
                console.error('Response Data:', ex.response.data);

                if (ex.response.data.errors) {
                    // Handle validation errors, display them, or take appropriate action
                    console.log('Validation Errors:', ex.response.data.errors);
                }

                this.error = ex;
            }
        }
    }
})
