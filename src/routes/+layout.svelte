<script lang="ts">
	import "./layout.css";
	import "iconify-icon";

	let { children } = $props();
</script>

<svelte:head>
	<title>HG Portfolio — Henryk</title>
</svelte:head>

{@render children()}
