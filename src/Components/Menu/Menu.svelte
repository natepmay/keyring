<script>
  import Button from "../Editor/Button.svelte";
  import Logo from "../Assets/Logo.svelte"
  import Info from "../Icon/Info.svelte";
</script>

<div class="header">
  <div class="header-left">
    <a href="https://synthase.cc" target="_blank" rel="noopener noreferrer" role="button" aria-label="Synthase home">
    <div class="logo">
      <Logo />
    </div>
   </a>
    <span class="slash">/</span>
    <h1>keyring</h1>
    <span class="beta">beta</span>
  </div>
  <!-- TODO: replace link with youtube video when uploaded -->
  <div class="info">
    <a href="https://www.wikipedia.org" target="_blank" rel="noopener noreferrer" role="button" aria-label="Help">
      <Info></Info>
    </a>

  </div>

</div>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header-left {
    padding: 0 1em;
    position: relative;
    display: flex;
    align-items: center;
  }
  .beta {
    font-family: 'Inter', sans-serif;
    font-size: 50%;
    background-color: hsl(0, 0%, 56%);
    padding: 0 0.5em;
    margin: 0 0.5em;
    border-radius: 0.4em;
  }
  .slash {
    font-family: 'Inter', sans-serif;
    color: white;
    font-size: 120%;
    margin: 0 0.5em;
  }
  .logo {
    width: 5em;
    display: flex;
    align-items: center;
  }
  .info {
    margin-right: 1em;
    width: 0.8em;
  }
  .button {
    position: absolute;
    top: 0;
    left: 1em;
  }
  h1 {
    font-family: 'Inter', sans-serif;
    font-weight: 400;
    font-size: 100%;
    letter-spacing: 0.06em;
    color: white;
    text-align: left;
  }
</style>
