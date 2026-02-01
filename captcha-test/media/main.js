'use strict'
$(document).ready(function () {
	wave()
	setInterval(function () {
		wave()
	}, 5000)

	// DOM element references
	var armLeft = document.getElementById('armLeft'),
		armRight = document.getElementById('armRight'),
		eyeNormal = document.getElementById('eyeNormal'),
		eyeBlink = document.getElementById('eyeBlink'),
		headBox = document.getElementById('rHeadBox'),
		mouth1 = document.getElementById('mouth1'),
		mouth2 = document.getElementById('mouth2'),
		mouth3 = document.getElementById('mouth3'),
		bodyBox = document.getElementById('rBodyBox'),
		isRotated = false

	// Toggle rotation animation on body and head every 4 seconds
	setInterval(function () {
		isRotated = isRotated
			? (bodyBox.classList.remove('rAnim'), headBox.classList.remove('rAnim'), false)
			: (bodyBox.classList.add('rAnim'), headBox.classList.add('rAnim'), true)
	}, 4000)

	// Blink animation every 5 seconds (300ms blink duration)
	setInterval(function () {
		setTimeout(function () {
			eyeNormal.classList.add('hide')
			eyeBlink.classList.add('showBlock')
		}, 0)
		setTimeout(function () {
			eyeNormal.classList.remove('hide')
			eyeBlink.classList.remove('showBlock')
		}, 300)
	}, 5000)

	var mouthAnimInterval,
		mouthAnimTimeout,
		mouthFrame = 0

	// Animate mouth talking (cycles through 4 mouth positions)
	function animateMouth() {
		if (mouthAnimInterval) {
			stopMouthAnimation()
		}

		mouthAnimInterval = setInterval(function () {
			if (mouthFrame === 0) {
				mouth1.classList.add('hide')
				mouth2.classList.remove('hide')
				mouth3.classList.add('hide')
			} else if (mouthFrame === 1) {
				mouth1.classList.add('hide')
				mouth2.classList.add('hide')
				mouth3.classList.remove('hide')
			} else if (mouthFrame === 2) {
				mouth1.classList.add('hide')
				mouth2.classList.remove('hide')
				mouth3.classList.add('hide')
			} else if (mouthFrame === 3) {
				mouth1.classList.remove('hide')
				mouth2.classList.add('hide')
				mouth3.classList.add('hide')
			}

			mouthFrame++
			if (mouthFrame > 3) {
				mouthFrame = 0
			}
		}, 170) // Each frame lasts 170ms

		// Stop mouth animation after ~1.7 seconds
		mouthAnimTimeout = setTimeout(function () {
			stopMouthAnimation()
		}, 1701)
	}

	// Stop mouth animation and reset to default state
	function stopMouthAnimation() {
		clearInterval(mouthAnimInterval)
		clearTimeout(mouthAnimTimeout)
		mouthFrame = 0
		$('#mouth1').removeClass('hide')
		$('#mouth2').removeClass('hide')
		$('#mouth3').removeClass('hide')
	}

	var armWaveInterval,
		isArmUp = false,
		isWaving = false

	// Main wave animation (arms + mouth)
	function wave() {
		animateMouth()

		// Prevent overlapping wave animations
		if (isWaving) {
			return
		}

		isWaving = true
		$('#armRight').addClass('armRightAnim')
		$('#armLeft').addClass('armRightAnim')
		isArmUp = true

		// Alternate arm positions every 250ms
		armWaveInterval = setInterval(function () {
			if (isArmUp) {
				isArmUp = false
				armRight.classList.remove('armRightAnim')
				armLeft.classList.remove('armLeftAnim')
			} else {
				isArmUp = true
				armRight.classList.add('armRightAnim')
				armLeft.classList.add('armLeftAnim')
			}
		}, 250)

		// Stop waving after 1.75 seconds
		setTimeout(function () {
			clearInterval(armWaveInterval)
			stopMouthAnimation()
			armRight.classList.remove('armRightAnim')
			armLeft.classList.remove('armLeftAnim')
			isWaving = false
		}, 1750)
	}
})