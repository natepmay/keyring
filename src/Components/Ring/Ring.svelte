<script>
  import { getAppState } from "../../State/AppState";
  import Keyboard from "./Keyboard/Keyboard.svelte";
  import PointerReceptors from "./PointerReceptors.svelte";
  import Rotator from "./Rotator/Rotator.svelte";
  import ShadowFilter from "./ShadowFilter.svelte";
  import Collection from "./Structures/Collection.svelte";

  const { keyboard } = getAppState();

  const viewBox = (() => {
    const boxSize = 1000;
    const x = 0 - boxSize / 2;
    return `${x} ${x} ${boxSize} ${boxSize}`;
  })();
</script>

<div class="ring">
  <!--
    Why use <object>?

    This is a hacky workaround for Safari which fails to correctly set
    `height: 100%` on the svg. For some reason wrapping the svg in an object
    (with the CSS below) seems to fix it.

    ref:
      - https://benfrain.com/attempting-to-fix-responsive-svgs-in-desktop-safari/
      - http://alistapart.com/article/creating-intrinsic-ratios-for-video/
  -->
  
  <object aria-label="ring"><!-- aria-label is only to appease svelte's linter -->
    <svg {viewBox} >
      <ShadowFilter
        id="shadow"
        blurRadius={15}
        offsetX={-2}
        offsetY={2}
        opacity={0.5}
      />
  
      <Rotator
        isRotatable={false}
        controller={keyboard.tonalCenterRotator}
        onRotationRest={(r) => keyboard.shift(r)}
      >
        <Keyboard controller={keyboard} />
      </Rotator>
  
      <Collection />
  
      <PointerReceptors />
    </svg>
  </object>
</div>

<style>
  object {
    width: 100%;
    display: 100%;
  } 
  .ring {
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  svg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
