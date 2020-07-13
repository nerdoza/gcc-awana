<template>
  <v-main>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>GCC AWANA</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn to="/help" icon v-on="on">
                    <v-icon>$info</v-icon>
                  </v-btn>
                </template>
                <span>Help</span>
              </v-tooltip>
            </v-toolbar>
            <v-card-text>
              <div class="text--primary">Welcome!</div>
              <div class="text--primary">Entering your mobile phone number below to get started.</div>
              <v-form>
                <v-text-field
                  label="Phone"
                  name="phone"
                  prepend-icon="$phone"
                  type="tel"
                  v-mask="'+1 (###) ###-####'"
                ></v-text-field>
              </v-form>
              <div
                class="text--primary"
              >You will receive a text message with a code to complete your sign in.</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" :disabled="!phoneNumberValid">Send code</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { mask } from 'vue-the-mask'

@Component({
  directives: {
    mask
  }
})
export default class extends Vue {
  phoneNumberValid = false
}
</script>
