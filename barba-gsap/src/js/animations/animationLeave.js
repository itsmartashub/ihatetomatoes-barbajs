import gsap from 'gsap';

const animationLeave = (container, done) => {
	// gsap.to(container, {
	// 	autoAlpha: 1,
	// 	duration: 2,
	// 	clearProps: 'all',
	// 	ease: 'none',
	// 	// onComplete: () => done(),
	// });

	const activeLink = container.querySelector('a.is-active span');
	const images = container.querySelectorAll('.image');
	const imgs = container.querySelectorAll('img');

	const tl = gsap.timeline({
		defaults: {
			duration: 0.4,
			ease: 'power1.in',
		},
	});

	tl.to(activeLink, { xPercent: 101 }, 0)
		.to(images, { xPercent: 101, stagger: 0.05 }, 0)
		.to(imgs, { xPercent: -101, stagger: 0.05 }, 0);

	// tl.timeScale(0.2);
	return tl;
};

export default animationLeave;
