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
		{ label:'JS Console',		link:'js' },
		{ label:'Image convert',	link:'image-convert' }
	],
	demos: [
		{ label:'Home',			link:'' },
		{ label:'Lists',		link:'lists' },
		{ label:'Forms',		link:'forms' },
		{ label:'Mixer',		link:'mixer' },
		{ label:'Table Grid',	link:'table-grid' },
		{ label:'ITEM',			link:'item/blabla' }
	],
	props: ['rootScope'],
	currentView: 'home'
}
</script>