<template>
	<section class="container has-nav">
		<nav class="nav fixed">
			<a v-for="link in links" :href="'#' + link.link" class="btn">{{link.label}}</a>
		</nav>
		<hr>
		<keep-alive>
			<component :is="rootScope.currentView" :root-scope="rootScope"></component>
		</keep-alive>
		<hr>
	</section>
</template>

<script>
exports = {
	links: [
		{ label:'Converter',		link:'converter' },
		{ label:'Testing',			link:'testing' },
		{ label:'JS Console',		link:'js-console' },
		{ label:'Image convert',	link:'image-convert' }
	],
	props: ['rootScope'],
	currentView: 'home'
}
</script>