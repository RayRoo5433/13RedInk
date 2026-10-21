<script>
  // Component ported from https://codepen.io/JuanFuentes/full/rgXKGQ (via the React version)
  import { onMount } from "svelte";

  let {
    text = "Compressa",
    fontFamily = "Compressa",
    fontUrl = "/CompressaPRO-GX.woff2",

    width = true,
    weight = true,
    italic = true,
    alpha = false,

    flex = true,
    stroke = false,
    scale = false,

    textColor = "var(--primary)",
    strokeColor = "#FF0000",
    className = "",

    minFontSize = 24,
  } = $props();

  let container;
  let title;
  let spans = $state([]);

  const mouse = { x: 0, y: 0 };
  const cursor = { x: 0, y: 0 };

  let fontSize = $state(minFontSize);
  let scaleY = $state(1);
  let lineHeight = $state(1);

  let chars = $derived(text.split(""));

  const dist = (a, b) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const setSize = () => {
    if (!container || !title) return;

    const { width: containerW, height: containerH } = container.getBoundingClientRect();

    fontSize = Math.max(containerW / (chars.length / 2), minFontSize);
    scaleY = 1;
    lineHeight = 1;

    requestAnimationFrame(() => {
      if (!title) return;
      const textRect = title.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        scaleY = yRatio;
        lineHeight = yRatio;
      }
    });
  };

  onMount(() => {
    const handleMouseMove = (e) => {
      cursor.x = e.clientX;
      cursor.y = e.clientY;
    };
    const handleTouchMove = (e) => {
      const t = e.touches[0];
      cursor.x = t.clientX;
      cursor.y = t.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    const { left, top, width: w, height: h } = container.getBoundingClientRect();
    mouse.x = cursor.x = left + w / 2;
    mouse.y = cursor.y = top + h / 2;

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  });

  // re-measure whenever scale or text changes, and on resize
  $effect(() => {
    scale;
    text;
    setSize();
    window.addEventListener("resize", setSize);
    return () => window.removeEventListener("resize", setSize);
  });

  $effect(() => {
    let rafId;
    const animate = () => {
      mouse.x += (cursor.x - mouse.x) / 15;
      mouse.y += (cursor.y - mouse.y) / 15;

      if (title) {
        const maxDist = title.getBoundingClientRect().width / 2;

        const getAttr = (distance, minVal, maxVal) => {
          const val = maxVal - Math.abs((maxVal * distance) / maxDist);
          return Math.max(minVal, val + minVal);
        };

        spans.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const d = dist(mouse, {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2,
          });

          const wdth = width ? Math.floor(getAttr(d, 5, 200)) : 100;
          const wght = weight ? Math.floor(getAttr(d, 100, 900)) : 400;
          const italVal = italic ? getAttr(d, 0, 1).toFixed(2) : 0;
          const alphaVal = alpha ? getAttr(d, 0, 1).toFixed(2) : 1;

          span.style.opacity = alphaVal;
          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  });
</script>

<svelte:head>
  {@html `<style>@font-face { font-family: '${fontFamily}'; src: url('${fontUrl}'); font-style: normal; }</style>`}
</svelte:head>

<div
  bind:this={container}
  class="text-pressure"
  style:--text-color={textColor}
  style:--stroke-color={strokeColor}
>
  <h1
    bind:this={title}
    class={["text-pressure-title", className, flex && "flex", stroke && "stroke"]}
    style:font-family={fontFamily}
    style:font-size="{fontSize}px"
    style:line-height={lineHeight}
    style:transform="scale(1, {scaleY})"
  >
    {#each chars as char, i}
      <span bind:this={spans[i]} data-char={char}>{char}</span>
    {/each}
  </h1>
</div>

<style>
  .text-pressure {
    position: absolute;
    width: 100%;
    height: 100%;
    background: transparent;
  }

  .text-pressure-title {
    color: var(--text-color);
    text-transform: uppercase;
    transform-origin: center top;
    margin: 0;
    text-align: center;
    user-select: none;
    white-space: nowrap;
    font-weight: 100;
    width: 100%;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }

  span {
    display: inline-block;
    color: var(--text-color);
  }

  .stroke span {
    position: relative;
  }
  .stroke span::after {
    content: attr(data-char);
    position: absolute;
    left: 0;
    top: 0;
    color: transparent;
    z-index: -1;
    -webkit-text-stroke-width: 3px;
    -webkit-text-stroke-color: var(--stroke-color);
  }
</style>
