'use strict';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
	// Cache DOM element references
	var armLeft = document.getElementById('armLeft'),
		armRight = document.getElementById('armRight'),
		eyeNormal = document.getElementById('eyeNormal'),
		eyeBlink = document.getElementById('eyeBlink'),
		headBox = document.getElementById('rHeadBox'),
		mouthWide = document.getElementById('mouth1'),
		mouthMedium = document.getElementById('mouth2'),
		mouthSmall = document.getElementById('mouth3'),
		bodyBox = document.getElementById('rBodyBox'),
		isBodySwaying = false;

	// Toggle body sway animation every 4 seconds
	setInterval(function () {
		if (isBodySwaying) {
			bodyBox.classList.remove('rAnim');
			headBox.classList.remove('rAnim');
			isBodySwaying = false;
		} else {
			bodyBox.classList.add('rAnim');
			headBox.classList.add('rAnim');
			isBodySwaying = true;
		}
	}, 4000);

	// Blink animation every 5 seconds (300ms blink duration)
	setInterval(function () {
		setTimeout(function () {
			eyeNormal.classList.add('hide');
			eyeBlink.classList.remove('hide');
		}, 0);
		setTimeout(function () {
			eyeNormal.classList.remove('hide');
			eyeBlink.classList.add('hide');
		}, 300);
	}, 5000);

	// Mouth animation state
	var mouthAnimInterval,
		mouthAnimTimeout,
		mouthFrame = 0;

	// Animate mouth talking (cycles through 4 mouth positions)
	function animateMouthTalking() {
		if (mouthAnimInterval) {
			stopMouthAnimation();
		}

		mouthAnimInterval = setInterval(function () {
			if (mouthFrame === 0) {
				mouthWide.classList.add('hide');
				mouthMedium.classList.remove('hide');
				mouthSmall.classList.add('hide');
			} else if (mouthFrame === 1) {
				mouthWide.classList.add('hide');
				mouthMedium.classList.add('hide');
				mouthSmall.classList.remove('hide');
			} else if (mouthFrame === 2) {
				mouthWide.classList.add('hide');
				mouthMedium.classList.remove('hide');
				mouthSmall.classList.add('hide');
			} else if (mouthFrame === 3) {
				mouthWide.classList.remove('hide');
				mouthMedium.classList.add('hide');
				mouthSmall.classList.add('hide');
			}

			mouthFrame++;
			if (mouthFrame > 3) {
				mouthFrame = 0;
			}
		}, 170); // Each frame lasts 170ms

		// Stop mouth animation after 1.5 seconds to match arm animation
		mouthAnimTimeout = setTimeout(function () {
			stopMouthAnimation();
		}, 1500);
	}

	// Stop mouth animation and reset to default state (mouth2 visible)
	function stopMouthAnimation() {
		clearInterval(mouthAnimInterval);
		clearTimeout(mouthAnimTimeout);
		mouthFrame = 0;
		mouthWide.classList.add('hide');
		mouthMedium.classList.remove('hide');
		mouthSmall.classList.add('hide');
	}

	// Wave animation state
	var armWaveInterval,
		areArmsRaised = false,
		isCurrentlyWaving = false;

	// Main wave animation (arms + mouth)
	function performWaveAnimation() {
		animateMouthTalking();

		// Prevent overlapping wave animations
		if (isCurrentlyWaving) {
			return;
		}

		isCurrentlyWaving = true;
		armRight.classList.add('armRightAnim');
		armLeft.classList.add('armLeftAnim');
		areArmsRaised = true;

		// Alternate arm positions every 250ms to create waving motion
		armWaveInterval = setInterval(function () {
			if (areArmsRaised) {
				areArmsRaised = false;
				armRight.classList.remove('armRightAnim');
				armLeft.classList.remove('armLeftAnim');
			} else {
				areArmsRaised = true;
				armRight.classList.add('armRightAnim');
				armLeft.classList.add('armLeftAnim');
			}
		}, 250);

		// Stop waving after 1.5 seconds (exactly 3 complete up-down cycles)
		setTimeout(function () {
			clearInterval(armWaveInterval);
			stopMouthAnimation();
			armRight.classList.remove('armRightAnim');
			armLeft.classList.remove('armLeftAnim');
			isCurrentlyWaving = false;
		}, 1500);
	}

	// Start wave animation and repeat every 5 seconds
	performWaveAnimation();
	setInterval(function () {
		performWaveAnimation();
	}, 5000);
});