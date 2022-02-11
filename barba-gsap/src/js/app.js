import barba from '@barba/core';
import barbaPrefetch from '@barba/prefetch';
import barbaRouter from '@barba/router';
import gsap from 'gsap';
import {
	revealProject,
	leaveToProject,
	leaveFromProject,
	animationEnter,
	animationLeave,
} from './animations';

const resetActiveLink = () =>
	// setujemo stil aktivnog linka da bude invisible (to je ona donja crta kao ispod linka)
	gsap.set('a.is-active span', {
		xPercent: -100,
		transformOrigin: 'left',
	});

barba.use(barbaPrefetch); //! prefetchuje sve *.html kad skrolujemo do njega (koristi Intersection Observer). Bez ovoga (prefetch-a) on valjda prefetchuje al NA HOVERRR

const myRoutes = [
	// nekad je bolje koristiti router, a ne namespace. Ako nam trebaju dynamic routes (recimo - path: '/product/:id'), itd
	{ name: 'home', path: '/index.html' },
	{ name: 'architecture', path: '/architecture.html' },
	{ name: 'detail', path: '/detail-page.html' },
	{ name: 'detail-2', path: '/detail-page-2.html' },
];

barba.use(barbaRouter, {
	routes: myRoutes,
});

barba.hooks.enter(data => {
	// global hook enter, dakle enter za svaku tranistion

	console.log({ data });
	window.scrollTo(0, 0);
});
barba.hooks.after(() => {
	console.log('after bilo koje tranzicije');
});

barba.init({
	views: [
		// zgodno za enablovanje ili disejblovanje pluginova, destroying,  ili event listenera, bil osta sto zelimo da uradimo pre ili nakon neke tranzicije specificnu za neku odredjenu stranicu
		{
			namespace: 'architecture', // konektujemo sa html containerom: dodajemo data-barba-namespace: 'architecture'
			beforeEnter(data) {
				console.log(data, 'beforeEnter architecture');
			},
		},
	],
	transitions: [
		{
			//? KADA IDEMO SA BILO KOJE STRANICE NA DETAIL-PAGE.HTML
			name: 'detail',
			to: {
				namespace: ['detail'],
			},
			once({ next }) {
				revealProject(next.container);
			},
			leave: ({ current }) => leaveToProject(current.container), //! ovo znaci: kada SA BILO KOJE STRANICE IDEMO NA DETAIL STRANICU. MA WTFFF. A onda kae kada idemo sa categories pages tj index i architecture WTF
			enter({ next }) {
				// kada idemo na detail stranicu zelimo istu animaciju kao once() na detail
				revealProject(next.container);
			},
		},

		{
			//? ANIMACIJE ZA INDEX.JS i ARCHITECTURE.JS
			name: 'general-transition',
			once({ next }) {
				//! ovaj once gazi onaj gore, iliti svaki prethodni, ali ako zelimo da se drugi once na detail stranici okine onda stavimo to: {namespace: ['detail']}
				resetActiveLink();

				gsap.from('header a', {
					// animiramo linkove iz ovih propertija u difoltna: prikazuju se od dole. I na kraju te animacije, prikazuje se container animationEnter tj ostatak stranice
					duration: 0.6,
					yPercent: 100,
					stagger: 0.2,
					ease: 'power1.out',
					onComplete: () => animationEnter(next.container),
				});
			},
			//! a mozemo i sve ovo dole u leave da obrisemo, i ono gore u gsap onComplete() i napisemo je kao arrow fn i odradice isto to
			// leave({ current }) {
			// 	console.log('leaving');
			// 	const done = this.async();
			// 	// we need to wait for this animation to finish before enter animation plays
			// 	animationLeave(current.container, done); // na kraju gsap animacije za leave, ova animationLeave ce jos i da opali done() f-ju koja se nalazi u onComplete() (to je deo gsap-a)
			// },
			leave: ({ current }) => animationLeave(current.container),
			enter({ next }) {
				console.log('entering');
				animationEnter(next.container);
			},
		},

		{
			//? KADA IDEMO SA DETAIL-PAGE.HTML NA BILO KOJU STR TJ INDEX.JS ili ARCHITECTURE.HTML
			name: 'from-detail',
			from: {
				// namespace: ['detail'], // ovo je za svaku str koja ima data-barba-namespace="detail", a ovo dole route: ['detail-2'] je samo za str. detail-page-2.html
				route: ['detail-2'],
			},
			leave: ({ current }) => leaveFromProject(current.container), // kada napustamo detail-page.html
			enter({ next }) {
				gsap.from('header a', {
					duration: 0.6,
					yPercent: 100,
					stagger: 0.2,
					ease: 'power1.out',
					// onComplete: () => animationEnter(next.container), //! ima kao neki delay, jer cekamo na onComplete da se odradi animationEnter. A kad izbacimo ovo animationEnter(next.container) vazn onComplete i van ovog gsap-a onda se odrade ovaj gsap i animationEnter(next.container), ISTOVREMENO
				});
				animationEnter(next.container);
			},
		},
	],
});
