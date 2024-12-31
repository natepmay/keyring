<script lang="ts">
  interface Props {
    id: string;
    blurRadius?: number;
    opacity?: number;
    bounds?: number;
    offsetX?: number;
    offsetY?: number;
  }

  let {
    id,
    blurRadius = 20,
    opacity = 1,
    bounds = 3,
    offsetX = 0,
    offsetY = 0
  }: Props = $props();
</script>

<filter
  id={id}
  x={-(bounds - 1) / 2}
  y={-(bounds - 1) / 2}
  width={bounds}
  height={bounds}
>
  <feGaussianBlur in="SourceAlpha" stdDeviation={blurRadius}/>
  <feOffset dx={offsetX} dy={offsetY} result="offsetblur"/>
  <feComponentTransfer>
    <feFuncA type="linear" slope={opacity}/>
  </feComponentTransfer>
  <feMerge> 
    <feMergeNode/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
