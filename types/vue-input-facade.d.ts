declare module 'vue-input-facade' {
  import { Component, DirectiveFunction, PluginObject  } from 'vue'

  interface Plugin extends PluginObject<undefined> {
    facade: DirectiveFunction;
    InputFacade: Component;
  }

  const VueInputFacade: Plugin
  export = VueInputFacade
}