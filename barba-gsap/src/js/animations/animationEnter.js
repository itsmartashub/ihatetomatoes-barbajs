import gsap from 'gsap';

const animationEnter = container => {
	// gsap.from(container, {
	// 	autoAlpha: 0,
	// 	duration: 2,
	// 	clearProps: 'all',
	// 	ease: 'none',
	// });

	const activeLink = container.querySelector('a.is-active span');
	const projects = container.querySelectorAll('.project');
	const images = container.querySelectorAll('.image');
	const imgs = container.querySelectorAll('img');

	const tl = gsap.timeline({
		defaults: {
			duration: 0.9,
			ease: 'power4.out',
		},
	});

	tl.set(projects, { autoAlpha: 1 }) // bice fully visible na pocetku ovog timeline
		.fromTo(
			activeLink,
			{ xPercent: -101 },
			{ xPercent: 0, transformOrigin: 'left' },
			0
		)
		.from(
			images,
			{
				xPercent: -101,
				stagger: 0.1,
			},
			0
		)
		.from(imgs, { xPercent: 101, stagger: 0.1 }, 0); //! za efekat reveal images, ovo ide uvek u suprotnom pravcu od wrappera (images u ovom slucaju), tzv masking

	// tl.timeScale(0.2);
	return tl;
};

export default animationEnter;
