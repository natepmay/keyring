<div class='button-group'>
  <slot />
</div>

<style>
  .button-group {
    display: flex;
  }
  .button-group > :global(*) {
    flex: 1 0 0;
  }
</style>