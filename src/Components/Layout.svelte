<script>
  import Editor from "./Editor/Editor.svelte";
  import Menu from "./Menu/Menu.svelte";
  import Ring from "./Ring/Ring.svelte";
</script>

<div class='layout'>
  <div class='area menu-area'>
    <Menu />
  </div>
  <div class='area ring-area'>
    <Ring />
  </div>
  <div class='area editor-area'>
    <Editor />
  </div>
</div>

<style>

  .layout {
    display: grid;
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: hidden;
    --layout-spacing: 0.7em;
  }

  .area {
    overflow: hidden;
  }

  /* Tall window */
  .layout {
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 100%;
  }
  .menu-area {
    grid-row: 1;
    grid-column: 1;
    background: var(--black-key-color);
  }
  .ring-area {
    grid-row: 2;
    grid-column: 1;
    padding: var(--layout-spacing);
  }
  .editor-area {
    grid-row: 3;
    grid-column: 1;
    padding: var(--layout-spacing);
    padding-top: 0;
  }


  /* Wide window */
  @media (min-aspect-ratio: 1 / 1) {
    .layout {
      grid-template-rows: auto 1fr;
      grid-template-columns: 50% 50%;
    }
    .menu-area {
      grid-row: 1;
      grid-column: 1 / span 2;
    }
    .ring-area {
      grid-row: 2;
      grid-column: 1;
    }
    .editor-area {
      grid-row: 2;
      grid-column: 2;
      padding-top: var(--layout-spacing);
      padding-left: 0;
    }
  }

</style>
