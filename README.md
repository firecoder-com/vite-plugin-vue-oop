@firecoder-com/vite-plugin-vue-oop 
==================================
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This package performs a live-patching (or [monkey patching](https://en.wikipedia.org/wiki/Monkey_patch))
of [@vitejs/plugin-vue](https://www.npmjs.com/package/@vitejs/plugin-vue) to enable Vue class components to make use
of inheritance and
[Object oriented Programming(OOP)](https://en.wikipedia.org/wiki/Object-oriented_programming).




Installation
------------

At the moment, this package is not yet published to the public but only available on the "GitHub Pages" NPM repository
of  this project. Therefore, you need to create a new or reuse an existing `.npmrc` file inside your project and
add the following content
(see [GitHub pages - installing a package](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package)).

```
@firecoder-com:registry=https://npm.pkg.github.com
```


Usage
-----

Import this package in your [`vite.config.ts`](https://vitejs.dev/config/) file like this:

```ts
import { defineConfig } from "vite";
import vue from "@firecoder-com/vite-plugin-vue-oop";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // ... more plugins ...
    ],
    // ... configuration ...
});
```




Configuration
-------------

This plugin makes use of the original plugin and just live-patches the return value of the plugin.
So, for configuration options see: [@vitejs/plugin-vue](https://www.npmjs.com/package/@vitejs/plugin-vue).




Motivation
----------

The original plugin removes the class from
the export and only returns its `__vccOpts` property (a.k.a. "Vue class component options"). This does not work well
with Vue class components implemented by a class hierarchy as no class to inherit from is eported.

As it is seems to be a deliberate decision by the developers of the original plugin to do so, this
[monkey patching](https://en.wikipedia.org/wiki/Monkey_patch) replacement was created. Because the reasoning behind
stripping the class and returning only `__vccOpts` by the vite build system is unknown, this seems better than
submitting a patch and risking unanticipated side effects.  Now, any user of Vite and Vue is able to decide, whether to
use this plugin or use the original one.

However, Vue would handle classes and inheritance deliberately
(see: [runtime-core #isClassComponent](https://github.com/vuejs/core/blob/eb2a83283caa9de0a45881d860a3cbd9d0bdd279/packages/runtime-core/src/component.ts#L1016)).  




Use case - [Oject oriented programming](https://en.wikipedia.org/wiki/Object-oriented_programming)
---------------------------------------------------------------------------------------------------

```
                   ---------------
                   |  ButtonBase |
                   ---------------
                          |
        __________________^____________________
        |                 |                   |
  -------------      -------------      -------------
  |  Button1  |      |  Button2  |      |  Button3  |
  -------------      -------------      -------------
                             
```
A base component implements the common behaviour of a menu buttons system, where all buttons look the same and behave
the same. Nevertheless, the icons, the descriptions and the actions, performed on button press, differ.
With the original `@vitejs/plugin-vue`, you need to copy the template and all the code to every button component as
there is no possibility to create a class hierarchy with components.

This plugin makes it possible to create a base component - even with a template. All buttons only need to overwrite
the action, the icon and the description. Implementing a menu with 20 buttons decreases the code dramatically.

I guess there is no need to talk about the benefits of
[OOP](https://en.wikipedia.org/wiki/Object-oriented_programming)?




Vue class component
-------------------

Although not widely known, there is a way to use classes with Vue 3 as
Vue knows "Vue Class components" (see:
[Vue 3 package `runtime-core`](https://github.com/vuejs/core/blob/eb2a83283caa9de0a45881d860a3cbd9d0bdd279/packages/runtime-core/src/component.ts)).
A class need to export a static member called `__vccOpts` containing a factory function
named `setup()`. This is the very same function from the
[Vue 3 composition API](https://vuejs.org/api/composition-api-setup.html#setup-context).
If a component of that class is created, its factory function is called to create the instance.  

See this example on [SFC Playground](https://sfc.vuejs.org/#eNqdVMGOmzAQ/ZUpJ5CyoKq3lERarVr10m61qtpDqVZeGIh3jW3ZJtko4t87NpCQTdRDrSixx/Nm3jxeOES3WqfbDqNllNvScO3Aouv0upAAvNXKOPiCQqhfyogKaqNaKKI087EQ8uAi+ljIPBvwhKSDw1YL5tCfXH6qkIXCOZe6c7C9aVWFYlVErW2KiK7y7AiMFtHQ/6ZlOn22ShLHg0cX44UtoiWEiI8FHkvabJzTdpllti49uWebKtNktEtNJx1vMUXb3jwZtbNoqHAR+RJ9IXtqeTaXF2U2CPHevF8fDtCitaxB6Ps8o8gZ7TD9qKRgsqHhPFGKj2oewGAN/STlJN946/YaKeVO0VGidPfacSXtZX4h8TUgKqxZJxyUglkLXwdqP/DV3dq7EBoV0t2T4OWR+8rTiIswsIIw8rsiSkJln24dc5QezBBro0hSeEBWKSn2+QOWylS5dYbLZgGdfJFqJ9frZPkPAn6VNIsDTl9Mlp6ExN0VSHzi4VeWAdNa7IEJAcRlyyus/EajcRztKZPXMJBN5l39un96xtKlDbr7nfw+QPffGMkxAs7T/UprZT6xchOHDJ+bwGo9VSLducSpUjzNtAi8fPLiLYVpEYf4gt98GRLdyFDI/p7K/SFJriX3i8t4n7wZZ4Ylo58OY6eJ/Jh2TCHh3YZboI/bINSCNbRhDlr2gkNssN1OmRfYcbeBnx3Ch/TMQ4+P27IkI5ODLny9musQzHbNQmm4mQ1KEhJ3WaG5VHKcKb7iREZmHHFLiAlKj3M0b9In6XAz12rWkihMLYefz50sqUooslW8uiDy3wzCn3NqcYVOT7HwjGbv3Kj/Cz1A2SQ=):

File `HelloWorld.vue`
```vue
<template>
  <h1>{{ message }}</h1>
</template>

<script lang="ts">
import { ref } from "vue";
import type { ComponentOptions } from "vue";

export default class MessageTextAsClass {
    public message = ref("Hello World!");

    static setup(props: Readonly<Record<string, unknown>>): MessageTextAsClass {
        const instance = new MessageTextAsClass();

        // apply all provided properties
        if (props) {
            Object.getOwnPropertyNames(props)
                .forEach((propName) => Object.defineProperty(instance, propName, {
                    get() {
                        return props[propName];
                    },
                }))
            ;
        }

        return instance;
    }

    // this is the flag that makes the class work with Vue 3.
    static __vccOpts: ComponentOptions = {
        setup: MessageTextAsClass.setup,
        get render() {
            return (MessageTextAsClass as { render: (() => unknown)}).render;
        },
        set render(renderFunc: () => void) {
            (MessageTextAsClass as { render: (() => unknown)}).render = renderFunc;
        },
    };
}

</script>
```

File `App.vue`
```vue
<script setup>
  import HelloWorld from "./HelloWorld.vue";
</script>

<template>
	<HelloWorld/>
  <input v-model="msg">
</template>
```

License
--------

[MIT](https://mit-license.org/)


