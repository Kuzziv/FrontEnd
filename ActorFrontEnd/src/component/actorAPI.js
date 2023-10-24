const baseCarUrl = "http://localhost:5263/api/Actor"

app.component("actor-api", {
    props: {},
    template: /*html*/ `
    <div>
        <button class="button" id="get-all-button" @click="getActors">Get list</button>
        <button class="button" id="clean-list-button" @click="cleanList">Clean list</button>
        <form class="actor-post">
            <h3>Make an actor object</h3>
            <label for="name">Name:</label>
            <input id="name" v-model="name" type="text" />
            <label for="birthyear">Birthyear:</label>
            <input id="birthyear" v-model="birthyear" type="number" />
            <button class="button" type="button" @click="postActor" id="Post-button">Post</button>
        </form>
        <form class="actor-update">
            <h3>Update an actor</h3>
            <label for="updatedId">Id:</label>
            <input id="updatedId" v-model="updatedId" type="number" />
            <label for="updatedName">Name:</label>
            <input id="updatedName" v-model="updatedName" type="text" />
            <label for="updatedBirthyear">Birthyear:</label>
            <input id="updatedBirthyear" v-model="updatedBirthyear" type="number" />
            <button class="button" type="button" @click="updateActor" id="put-button">Update</button>
        </form>
        <form class="actor-filter">
            <h3>Filter actors</h3>
            <label for="filterName">Name:</label>
            <input id="filterName" v-model="filterName" type="text" />
            <label for="filterBirthyear">Birthyear:</label>
            <input id="filterBirthyear" v-model="filterBirthyear" type="number" />
            <label for="filterOrderBy">Order By:</label>
            <input id="filterOrderBy" v-model="filterOrderBy" type="text" />
            <button class="button" type="button" @click="filterActors" id="filter-button">Filter</button>
        </form>
        <ol v-if="actors.length > 0">
        <li v-for="actor in actors" :key="actor.id">
            <h3>
            Id: {{ actor.id }}, Name: {{ actor.name }}, Birthyear: {{ actor.birthYear }}
            <button class="button" @click="deleteActor(actor.id)">Delete</button>
            </h3>
        </li>
        </ol>
    </div>
    `,
    data() {
        return {
            message: "Hello World! from Vue.js (actor API)",
            actors: [],
            filteredActors: [],
            error: null,
            name: "",
            birthyear: 0,
            updatedId: 0,
            updatedName: "",
            updatedBirthyear: 0,
            filterName: null,
            filterBirthyear: null,
            filterOrderBy: null,
        }
    },
    methods: {
        cleanList() {
            this.actors = []
            this.error = null
        },
        async getActors() {
            try {
                const response = await axios.get(baseCarUrl)
                this.actors = await response.data

                console.log('Get response:', response);

                this.error = null
            } catch (ex) {
                this.posts = []
                this.error = ex.Message;
            }
        },
        async postActor() {
            try {
                const actor = {
                    name: this.name,
                    birthyear: this.birthyear,
                };
                const response = await axios.post(baseCarUrl, actor, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                this.actors.push(await response.data);

                console.log('Post response:', response);

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
        },
        async deleteActor(actorId) {
            try {
                const response = await axios.delete(`${baseCarUrl}/${actorId}`);
                this.actors = this.actors.filter((actor) => actor.id !== actorId);

                console.log('Delete response:', response);

                this.error = null;
            } catch (ex) {
                console.error('Error:', ex);
                console.error('Response Data:', ex.response.data);
                this.error = ex;
            }
        },
        async updateActor(actor) {
            try {
                const updatedData = {
                    id: this.updatedId,
                    name: this.updatedName,
                    birthyear: this.updatedBirthyear,
                };

                const response = await axios.put(`${baseCarUrl}/${this.updatedId}`, updatedData, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Update response:', response);

                // Update the actor in the local data by calling getActors() again
                await this.getActors();

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
        },
        async filterActors() {
            try {
              const filters = {
                name: this.filterName,
                birthYear: this.filterBirthyear,
                orderBy: this.filterOrderBy,
              };
          
              // Filter the valid filter parameters
              const validFilters = Object.keys(filters)
                .filter(key => filters[key])
                .map(key => `${key}=${encodeURIComponent(filters[key])}`);
          
              if (validFilters.length === 0) {
                console.log('No valid filters provided');
                return;
              }
          
              const queryString = validFilters.join('&');
              const url = `${baseCarUrl}?${queryString}`;
          
              const response = await axios.get(url);
              if (response.status === 200) {
                this.filteredActors = response.data;
                console.log('Filter response:', response);
                console.log('Filtered actors:', this.filteredActors);
                console.log('parameters:', queryString);
                this.error = null;
              } else {
                console.error('Request failed with status:', response.status);
                this.error = `Error: Request failed with status ${response.status}`;
              }
            } catch (ex) {
              console.error('Error:', ex);
              this.error = `Error: ${ex.message}`;
            }
          }
          
    },
});
