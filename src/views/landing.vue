<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="8" md="6" lg="4" xl="2">
      <v-card class="elevation-12">
        <v-card-text>
          <v-row align="center" justify="center">
            <v-col cols="5">
              <v-img src="~@/assets/gcc.png"></v-img>
            </v-col>
            <v-col cols="5">
              <v-img src="~@/assets/awana.svg"></v-img>
            </v-col>
          </v-row>
          <h1 class="mb-4">Welcome!</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus non eros odio. Duis malesuada semper tortor, vitae lacinia dolor ultrices a. Maecenas varius dui nisi, at placerat risus placerat id.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="getStarted()">Get Started</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class extends Vue {
  getStarted () {
    this.$router.push({ name: 'AuthStart' })
  }
}
</script>
