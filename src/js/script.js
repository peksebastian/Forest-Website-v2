const burgerBtn = document.querySelector('.mobile-nav__hamburger')
const burgerIco = document.querySelector('.fa-bars')
const xIco = document.querySelector('.fa-x')
const nav = document.querySelector('.mobile-nav__items')
const footerYear = document.querySelector('.footer__year')
const navItem = document.querySelectorAll('.nav__item')

const handleNav = () => {
	nav.classList.toggle('active')
	xIco.classList.toggle('hide')
	burgerIco.classList.toggle('hide')

	navItem.forEach((item) => {
		item.addEventListener('click', () => {
			nav.classList.toggle('active')
			xIco.classList.toggle('hide')
			burgerIco.classList.toggle('hide')
		})
	})
}

const handleCurrentYear = () => {
	const year = new Date().getFullYear()
	footerYear.innerText = year
}

handleCurrentYear()
burgerBtn.addEventListener('click', handleNav)
