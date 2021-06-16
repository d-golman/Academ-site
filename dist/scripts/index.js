document.addEventListener('DOMContentLoaded', () => {
    //превью
    const shown = window.localStorage.getItem('previewShown') ? window.localStorage.getItem('previewShown') : false
    const overlay = document.querySelector('.overlay')
    const closeOverlay = document.querySelector('#close-overlay')
    if (shown) {
        overlay.style.display = 'none'
    }
    else {
        window.localStorage.setItem('previewShown', true)
    }
    closeOverlay.addEventListener('click', (e) => {
        e.preventDefault()
        overlay.style.display = 'none'
    })

    // Перетаскивание фона
    const scrollDistance = (new URL(document.location)).searchParams.get('scroll') ? +(new URL(document.location)).searchParams.get('scroll') : 0
    const scrollBlock = document.querySelector('#scroll-block')
    scrollBlock.style.left = -scrollBlock.offsetWidth / scrollDistance + 'px'
    let dragging = false
    let previousPosition = 0

    const clientPosition = (e) => e.clientX ? e.clientX : e.changedTouches[0].clientX

    const start = (e, type = 'mouse') => {
        if (type === 'mouse') {
            e.preventDefault()
        }
        dragging = true
        previousPosition = clientPosition(e)
    }
    const end = (e, type = 'mouse') => {
        if (type === 'mouse') {
            e.preventDefault()
        }
        if (e.target.parentElement.tagName === 'A' && !dragging && e.button == 0) {

            window.location.href = e.target.parentElement.href
        }
        dragging = false
        scrollBlock.style.cursor = 'grab'

    }

    const drag = e => {
        if (dragging) {
            scrollBlock.style.cursor = 'grabbing'
            scrollBlock.style.left = scrollBlock.offsetLeft - (previousPosition - clientPosition(e)) + 'px'
            if (scrollBlock.offsetLeft > 0) {
                scrollBlock.style.left = '0px'
            }
            else if (scrollBlock.offsetLeft < -(scrollBlock.offsetWidth - 1 * window.innerWidth)) {
                scrollBlock.style.left = -(scrollBlock.offsetWidth - 1 * window.innerWidth) + 'px'

            }
            previousPosition = clientPosition(e)
        }

    }

    scrollBlock.ondragstart = e => start(e)
    scrollBlock.ontouchstart = e => start(e, type = 'touch')

    scrollBlock.onmouseup = e => end(e)
    scrollBlock.ontouchend = e => end(e, type = 'touch')

    scrollBlock.onmousemove = e => drag(e)
    scrollBlock.ontouchmove = e => drag(e)

    const wheel = e => {
        scrollBlock.style.left = scrollBlock.offsetLeft - e.deltaY + 'px'
        if (scrollBlock.offsetLeft > 0) {
            scrollBlock.style.left = '0px'
        }
        else if (scrollBlock.offsetLeft < -(scrollBlock.offsetWidth - 1 * window.innerWidth)) {
            scrollBlock.style.left = -(scrollBlock.offsetWidth - 1 * window.innerWidth) + 'px'

        }
    }

    scrollBlock.addEventListener('wheel', e => wheel(e))

    //Отображение названия
    const links = document.querySelectorAll('.link')
    const nameBar = document.querySelector('.name-bar')
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault()
        })

        link.addEventListener('mouseover', e => {
            e.preventDefault()
            nameBar.querySelector('p').innerHTML = (e.target.alt)
        })
        link.addEventListener('mouseout', e => {
            e.preventDefault()
            nameBar.querySelector('p').innerHTML = '&nbsp;'
        })
    })


    setTimeout(() => { window.scrollTo(0, 0) }, 100)
})