(function (cjs, an) {

	var p; // shortcut to reference prototypes
	var lib = {}; var ss = {}; var img = {};
	var rect; // used to reference frame bounds
	lib.ssMetadata = [
		{ name: "YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1", frames: [[0, 0, 1154, 210], [0, 212, 1154, 210], [0, 424, 1154, 210], [0, 636, 1154, 210], [0, 848, 1154, 210], [0, 1060, 1154, 210], [0, 1272, 1154, 210], [0, 1484, 1154, 210], [0, 1696, 1154, 210]] },
		{ name: "YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2", frames: [[0, 0, 1154, 210], [0, 212, 1154, 210], [0, 424, 1154, 210], [0, 636, 1154, 210], [0, 848, 1154, 210], [0, 1060, 1154, 210], [0, 1272, 1154, 210]] }
	];


	(lib.AnMovieClip = function () {
		this.actionFrames = [];
		this.ignorePause = false;
		this.currentSoundStreamInMovieclip;
		this.soundStreamDuration = new Map();
		this.streamSoundSymbolsList = [];

		this.gotoAndPlayForStreamSoundSync = function (positionOrLabel) {
			cjs.MovieClip.prototype.gotoAndPlay.call(this, positionOrLabel);
		}
		this.gotoAndPlay = function (positionOrLabel) {
			this.clearAllSoundStreams();
			var pos = this.timeline.resolve(positionOrLabel);
			if (pos != null) { this.startStreamSoundsForTargetedFrame(pos); }
			cjs.MovieClip.prototype.gotoAndPlay.call(this, positionOrLabel);
		}
		this.play = function () {
			this.clearAllSoundStreams();
			this.startStreamSoundsForTargetedFrame(this.currentFrame);
			cjs.MovieClip.prototype.play.call(this);
		}
		this.gotoAndStop = function (positionOrLabel) {
			cjs.MovieClip.prototype.gotoAndStop.call(this, positionOrLabel);
			this.clearAllSoundStreams();
		}
		this.stop = function () {
			cjs.MovieClip.prototype.stop.call(this);
			this.clearAllSoundStreams();
		}
		this.startStreamSoundsForTargetedFrame = function (targetFrame) {
			for (var index = 0; index < this.streamSoundSymbolsList.length; index++) {
				if (index <= targetFrame && this.streamSoundSymbolsList[index] != undefined) {
					for (var i = 0; i < this.streamSoundSymbolsList[index].length; i++) {
						var sound = this.streamSoundSymbolsList[index][i];
						if (sound.endFrame > targetFrame) {
							var targetPosition = Math.abs((((targetFrame - sound.startFrame) / lib.properties.fps) * 1000));
							var instance = playSound(sound.id);
							var remainingLoop = 0;
							if (sound.offset) {
								targetPosition = targetPosition + sound.offset;
							}
							else if (sound.loop > 1) {
								var loop = targetPosition / instance.duration;
								remainingLoop = Math.floor(sound.loop - loop);
								if (targetPosition == 0) { remainingLoop -= 1; }
								targetPosition = targetPosition % instance.duration;
							}
							instance.loop = remainingLoop;
							instance.position = Math.round(targetPosition);
							this.InsertIntoSoundStreamData(instance, sound.startFrame, sound.endFrame, sound.loop, sound.offset);
						}
					}
				}
			}
		}
		this.InsertIntoSoundStreamData = function (soundInstance, startIndex, endIndex, loopValue, offsetValue) {
			this.soundStreamDuration.set({ instance: soundInstance }, { start: startIndex, end: endIndex, loop: loopValue, offset: offsetValue });
		}
		this.clearAllSoundStreams = function () {
			this.soundStreamDuration.forEach(function (value, key) {
				key.instance.stop();
			});
			this.soundStreamDuration.clear();
			this.currentSoundStreamInMovieclip = undefined;
		}
		this.stopSoundStreams = function (currentFrame) {
			if (this.soundStreamDuration.size > 0) {
				var _this = this;
				this.soundStreamDuration.forEach(function (value, key, arr) {
					if ((value.end) == currentFrame) {
						key.instance.stop();
						if (_this.currentSoundStreamInMovieclip == key) { _this.currentSoundStreamInMovieclip = undefined; }
						arr.delete(key);
					}
				});
			}
		}

		this.computeCurrentSoundStreamInstance = function (currentFrame) {
			if (this.currentSoundStreamInMovieclip == undefined) {
				var _this = this;
				if (this.soundStreamDuration.size > 0) {
					var maxDuration = 0;
					this.soundStreamDuration.forEach(function (value, key) {
						if (value.end > maxDuration) {
							maxDuration = value.end;
							_this.currentSoundStreamInMovieclip = key;
						}
					});
				}
			}
		}
		this.getDesiredFrame = function (currentFrame, calculatedDesiredFrame) {
			for (var frameIndex in this.actionFrames) {
				if ((frameIndex > currentFrame) && (frameIndex < calculatedDesiredFrame)) {
					return frameIndex;
				}
			}
			return calculatedDesiredFrame;
		}

		this.syncStreamSounds = function () {
			this.stopSoundStreams(this.currentFrame);
			this.computeCurrentSoundStreamInstance(this.currentFrame);
			if (this.currentSoundStreamInMovieclip != undefined) {
				var soundInstance = this.currentSoundStreamInMovieclip.instance;
				if (soundInstance.position != 0) {
					var soundValue = this.soundStreamDuration.get(this.currentSoundStreamInMovieclip);
					var soundPosition = (soundValue.offset ? (soundInstance.position - soundValue.offset) : soundInstance.position);
					var calculatedDesiredFrame = (soundValue.start) + ((soundPosition / 1000) * lib.properties.fps);
					if (soundValue.loop > 1) {
						calculatedDesiredFrame += (((((soundValue.loop - soundInstance.loop - 1) * soundInstance.duration)) / 1000) * lib.properties.fps);
					}
					calculatedDesiredFrame = Math.floor(calculatedDesiredFrame);
					var deltaFrame = calculatedDesiredFrame - this.currentFrame;
					if ((deltaFrame >= 0) && this.ignorePause) {
						cjs.MovieClip.prototype.play.call(this);
						this.ignorePause = false;
					}
					else if (deltaFrame >= 2) {
						this.gotoAndPlayForStreamSoundSync(this.getDesiredFrame(this.currentFrame, calculatedDesiredFrame));
					}
					else if (deltaFrame <= -2) {
						cjs.MovieClip.prototype.stop.call(this);
						this.ignorePause = true;
					}
				}
			}
		}
	}).prototype = p = new cjs.MovieClip();
	// symbols:



	(lib.CachedBmp_16 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1"]);
		this.gotoAndStop(0);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_15 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1"]);
		this.gotoAndStop(1);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_14 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1"]);
		this.gotoAndStop(2);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_13 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1"]);
		this.gotoAndStop(3);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_12 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1"]);
		this.gotoAndStop(4);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_11 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1"]);
		this.gotoAndStop(5);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_10 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1"]);
		this.gotoAndStop(6);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_9 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1"]);
		this.gotoAndStop(7);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_8 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1"]);
		this.gotoAndStop(8);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_7 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2"]);
		this.gotoAndStop(0);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_6 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2"]);
		this.gotoAndStop(1);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_5 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2"]);
		this.gotoAndStop(2);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_4 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2"]);
		this.gotoAndStop(3);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_3 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2"]);
		this.gotoAndStop(4);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_2 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2"]);
		this.gotoAndStop(5);
	}).prototype = p = new cjs.Sprite();



	(lib.CachedBmp_1 = function () {
		this.initialize(ss["YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2"]);
		this.gotoAndStop(6);
	}).prototype = p = new cjs.Sprite();



	(lib.Symbol5 = function (mode, startPosition, loop, reversed) {
		if (loop == null) { loop = true; }
		if (reversed == null) { reversed = false; }
		var props = new Object();
		props.mode = mode;
		props.startPosition = startPosition;
		props.labels = {};
		props.loop = loop;
		props.reversed = reversed;
		cjs.MovieClip.apply(this, [props]);

		// Layer_1
		this.shape = new cjs.Shape();
		this.shape.graphics.f().s("#000000").ss(6.3, 1, 1).p("EAsWAOAQAADQiTCSQiSCUjQAAQjPAAiTiUQiTiSAAjQQAAjPCTiTQCTiTDPAAQDQAACSCTQCTCTAADPgEApnAQAQgZAngjAkQhuBtibAAQibAAhthtQgogogZguEA+gAuyMh8/AAAMAAAhdjMB8/AAAgAmGIuQCTiSDQAAQDOAACTCSQCSCTAADQQAADPiSCTQiTCTjOAAQjQAAiTiTQiTiTAAjPQAAjQCTiTgEgpSAIYQCTiTDQAAQDPAACTCTQCTCTAADPQAADQiTCTQiTCSjPAAQjQAAiTiSQiSiTAAjQQAAjPCSiTgA+qP6QgXAogkAjQhuBuibAAQibAAhthuQgogogZgtAEhQQQgYAogkAjQhtBuiaAAQibAAhthuQgogogZgt");
		this.shape.setTransform(399.95, 299.35);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.f("#FFFFFF").s().p("Eg+fAuxMAAAhdiMB8/AAAMAAABdigAoYORQAADPCSCTQCTCTDPAAQDPAACTiTQCTiTgBjPQABjPiTiTQiTiTjPAAQjPAAiTCTQiSCTAADPIAAAAgAcsOAQAADQCTCTQCSCSDQABQDPgBCTiSQCTiTAAjQQAAjPiTiTQiTiTjPABQjQgBiSCTQiTCTAADPIAAAAgEgrkAN7QAADPCTCTQCSCTDQgBQDPABCTiTQCTiTAAjPQAAjQiTiTQiTiSjPAAQjQAAiSCSQiTCTAADQIAAAAgAmGTzQiSiTAAjPQAAjPCSiTQCTiTDPAAQDPAACTCTQCTCTgBDPQABDPiTCTQiTCTjPAAQjPAAiTiTgAkrRcQBuBtCbAAQCaAABuhtQAjgkAYgoQgYAogjAkQhuBtiaAAQibAAhuhtQgngogZguQAZAuAnAogAAWKpQgbAdAAAoQAAAoAbAcQAcAdAoAAQAoAAAcgdQAdgcAAgoQAAgogdgdQgcgcgoAAQgoAAgcAcgAj7KhQgcAdAAAoQAAAoAcAcQAcAcApABQAngBAdgcQAcgcAAgoQAAgogcgdQgdgcgnAAQgpAAgcAcgAe/TjQiTiTAAjQQAAjPCTiTQCSiTDQABQDPgBCTCTQCTCTAADPQAADQiTCTQiTCSjPABQjQgBiSiSgEAgaARLQBtBtCbABQCcgBBthtQAjgjAYgoQgYAogjAjQhtBticABQibgBhthtQgogogZguQAZAuAoAogEAlcAKZQgdAcAAAoQAAApAdAcQAcAcAoAAQAoAAAcgcQAcgcABgpQgBgogcgcQgcgcgoAAQgoAAgcAcgEAhJAKRQgcAcAAAoQAAApAcAcQAdAcAoAAQAoAAAcgcQAcgcAAgpQAAgogcgcQgcgcgoAAQgoAAgdAcgEgpRATdQiTiTAAjPQAAjQCTiTQCSiSDQAAQDPAACTCSQCTCTAADQQAADPiTCTQiTCTjPgBQjQABiSiTgEgn2ARFQBuBuCagBQCcABBthuQAkgkAXgnQgXAngkAkQhtBuicgBQiaABhuhuQgogogZgtQAZAtAoAogEgi0AKTQgcAcAAAoQAAAoAcAcQAcAdAoAAQAoAAAcgdQAcgcAAgoQAAgogcgcQgcgcgoAAQgoAAgcAcgEgnHAKLQgcAdAAAoQAAAoAcAbQAdAdAoAAQAoAAAcgdQAdgbAAgoQAAgogdgdQgcgcgoAAQgoAAgdAcgEAsWAOAIAAAAgAmGIvIAAAAgEgpRAIYIAAAAg");
		this.shape_1.setTransform(399.95, 299.35);

		this.shape_2 = new cjs.Shape();
		this.shape_2.graphics.f("#000000").s().p("AAHBTQgbgcAAgoQAAgnAbgcQAdgcAoAAQAoAAAcAcQAdAcAAAnQAAAogdAcQgcAdgoAAQgoAAgdgdgAkJBLQgcgcAAgoQAAgnAcgcQAcgcAoAAQAoAAAcAcQAdAcgBAnQABAogdAcQgcAdgoAAQgoAAgcgdgEAlNABDQgcgcAAgnQAAgoAcgdQAdgcAoAAQAoAAAbAcQAdAdAAAoQAAAngdAcQgbAcgoAAQgoAAgdgcgEgjDAA9QgcgcAAgnQAAgoAcgdQAdgcAoAAQAoAAAbAcQAdAdAAAoQAAAngdAcQgbAcgoAAQgoAAgdgcgEAg7AA7QgcgcAAgnQAAgoAcgdQAcgcAoAAQApAAAcAcQAcAdAAAoQAAAngcAcQgcAcgpAAQgoAAgcgcgEgnVAA1QgcgcAAgnQAAgoAcgdQAcgcAoAAQAoAAAdAcQAcAdAAAoQAAAngcAcQgdAcgoAAQgoAAgcgcg");
		this.shape_2.setTransform(401.4, 372.825);

		this.timeline.addTween(cjs.Tween.get({}).to({ state: [{ t: this.shape_2 }, { t: this.shape_1 }, { t: this.shape }] }).wait(1));

		this._renderFirstFrame();

	}).prototype = p = new cjs.MovieClip();
	p.nominalBounds = rect = new cjs.Rectangle(-3.1, -3.1, 806.1, 604.9);
	p.frameBounds = [rect];


	(lib.Symbol1 = function (mode, startPosition, loop, reversed) {
		if (loop == null) { loop = true; }
		if (reversed == null) { reversed = false; }
		var props = new Object();
		props.mode = mode;
		props.startPosition = startPosition;
		props.labels = {};
		props.loop = loop;
		props.reversed = reversed;
		cjs.MovieClip.apply(this, [props]);

		// Layer_1
		this.shape = new cjs.Shape();
		this.shape.graphics.f().s("#FFFFFF").ss(6.3, 1, 1).p("EAsWAOAQAADQiTCSQiSCUjQAAQjPAAiTiUQiTiSAAjQQAAjPCTiTQCTiTDPAAQDQAACSCTQCTCTAADPgEAnkAMhQgcAdgoAAQgoAAgcgdQgcgcAAgoQAAgoAcgcQAcgcAoAAQAoAAAcAcQAdAcAAAoQAAAogdAcgEApnAQAQgZAngjAkQhuBtibAAQibAAhthtQgogogZguEA+gAuyMh8/AAAMAAAhdjMB8/AAAgAmGIuQCTiSDQAAQDOAACTCSQCSCTAADQQAADPiSCTQiTCTjOAAQjQAAiTiTQiTiTAAjPQAAjQCTiTgAi2KFQAoAAAbAcQAdAdAAAoQAAAogdAcQgbAcgoAAQgoAAgdgcQgcgcAAgoQAAgoAcgdQAdgcAoAAgAgFLuQAAgoAbgdQAdgcAoAAQAoAAAcAcQAcAdAAAoQAAAogcAcQgcAcgoAAQgoAAgdgcQgbgcAAgogEAjSAKRQAdAcAAAoQAAAogdAcQgcAdgoAAQgoAAgcgdQgdgcAAgoQAAgoAdgcQAcgcAoAAQAoAAAcAcgEgmCAJvQAoAAAcAcQAcAcAAAoQAAAogcAdQgcAcgoAAQgoAAgdgcQgcgdAAgoQAAgoAcgcQAdgcAoAAgEgpSAIYQCTiTDQAAQDPAACTCTQCTCTAADPQAADQiTCTQiTCSjPAAQjQAAiTiSQiSiTAAjQQAAjPCSiTgEggsAKTQAcAdAAAoQAAAogcAbQgcAdgoAAQgoAAgdgdQgcgbAAgoQAAgoAcgdQAdgcAoAAQAoAAAcAcgA+qP6QgXAogkAjQhuBuibAAQibAAhthuQgogogZgtAEhQQQgYAogkAjQhtBuiaAAQibAAhthuQgogogZgt");
		this.shape.setTransform(399.95, 299.35);

		this.shape_1 = new cjs.Shape();
		this.shape_1.graphics.f("#000000").s().p("Eg+fAuxMAAAhdiMB8/AAAMAAABdigAoYORQAADPCSCTQCTCTDPAAQDPAACTiTQCTiTgBjPQABjPiTiTQiTiTjPAAQjPAAiTCTQiSCTAADPIAAAAgAcsOAQAADQCTCTQCSCSDQABQDPgBCTiSQCTiTAAjQQAAjPiTiTQiTiTjPABQjQgBiSCTQiTCTAADPIAAAAgEgrkAN7QAADPCTCTQCSCTDQgBQDPABCTiTQCTiTAAjPQAAjQiTiTQiTiSjPAAQjQAAiSCSQiTCTAADQIAAAAgAmGTzQiSiTAAjPQAAjPCSiTQCTiTDPAAQDPAACTCTQCTCTgBDPQABDPiTCTQiTCTjPAAQjPAAiTiTgAkrRcQBuBtCbAAQCaAABuhtQAjgkAYgoQgYAogjAkQhuBtiaAAQibAAhuhtQgngogZguQAZAuAnAogAAWMyQAcAdAoAAQAoAAAcgdQAdgcAAgoQAAgogdgdQgcgcgoAAQgoAAgcAcQgbAdAAAoQAAAoAbAcgAkXLmQAAAoAcAcQAcAcApABQAngBAdgcQAcgcAAgoQAAgogcgdQgdgcgnAAQAnAAAdAcQAcAdAAAoQAAAogcAcQgdAcgnABQgpgBgcgcQgcgcAAgoQAAgoAcgdQAcgcApAAQgpAAgcAcQgcAdAAAoIAAAAgAe/TjQiTiTAAjQQAAjPCTiTQCSiTDQABQDPgBCTCTQCTCTAADPQAADQiTCTQiTCSjPABQjQgBiSiSgEAgaARLQBtBtCbABQCcgBBthtQAjgjAYgoQgYAogjAjQhtBticABQibgBhthtQgogogZguQAZAuAoAogEAk/ALdQAAApAdAcQAcAcAoAAQAoAAAcgcQgcAcgoAAQgoAAgcgcQgdgcAAgpQAAgoAdgcQAcgcAoAAQAoAAAcAcQAcAcABAoQgBApgcAcQAcgcABgpQgBgogcgcQgcgcgoAAQgoAAgcAcQgdAcAAAoIAAAAgEAgtALVQAAApAcAcQAdAcAoAAQAoAAAcgcQAcgcAAgpQAAgogcgcQAcAcAAAoQAAApgcAcQgcAcgoAAQgoAAgdgcQgcgcAAgpQAAgoAcgcQAdgcAoAAQAoAAAcAcQgcgcgoAAQgoAAgdAcQgcAcAAAoIAAAAgEgpRATdQiTiTAAjPQAAjQCTiTQCSiSDQAAQDPAACTCSQCTCTAADQQAADPiTCTQiTCTjPgBQjQABiSiTgEgn2ARFQBuBuCagBQCcABBthuQAkgkAXgnQgXAngkAkQhtBuicgBQiaABhuhuQgogogZgtQAZAtAoAogEgjQALXQAAAoAcAcQAcAdAoAAQAoAAAcgdQAcgcAAgoQAAgogcgcQAcAcAAAoQAAAogcAcQgcAdgoAAQgoAAgcgdQgcgcAAgoQAAgoAcgcQAcgcAoAAQAoAAAcAcQgcgcgoAAQgoAAgcAcQgcAcAAAoIAAAAgEgnjALQQAAAoAcAbQAdAdAoAAQAoAAAcgdQAdgbAAgoQAAgogdgdQgcgcgoAAQAoAAAcAcQAdAdAAAoQAAAogdAbQgcAdgoAAQgoAAgdgdQgcgbAAgoQAAgoAcgdQAdgcAoAAQgoAAgdAcQgcAdAAAoIAAAAgEAsWAOAIAAAAgAAWMyQgbgcAAgoQAAgoAbgdQAcgcAoAAQAoAAAcAcQAdAdAAAoQAAAogdAcQgcAdgoAAQgoAAgcgdgAgFLuIAAAAgAmGIvIAAAAgEgpRAIYIAAAAg");
		this.shape_1.setTransform(399.95, 299.35);

		this.timeline.addTween(cjs.Tween.get({}).to({ state: [{ t: this.shape_1 }, { t: this.shape }] }).wait(1));

		this._renderFirstFrame();

	}).prototype = p = new cjs.MovieClip();
	p.nominalBounds = rect = new cjs.Rectangle(-3.1, -3.1, 806.1, 604.9);
	p.frameBounds = [rect];


	// stage content:
	(lib.youare_HTML5Canvas = function (mode, startPosition, loop, reversed) {
		if (loop == null) { loop = true; }
		if (reversed == null) { reversed = false; }
		var props = new Object();
		props.mode = mode;
		props.startPosition = startPosition;
		props.labels = {};
		props.loop = loop;
		props.reversed = reversed;
		cjs.MovieClip.apply(this, [props]);

		this.actionFrames = [0];
		this.streamSoundSymbolsList[0] = [{ id: "sound4", startFrame: 0, endFrame: 64, loop: 1, offset: 0 }];
		// timeline functions:
		this.frame_0 = function () {
			this.clearAllSoundStreams();

			var soundInstance = playSound("sound4", 0);
			this.InsertIntoSoundStreamData(soundInstance, 0, 64, 1);
		}

		// actions tween:
		this.timeline.addTween(cjs.Tween.get(this).call(this.frame_0).wait(64));

		// Text
		this.instance = new lib.CachedBmp_1();
		this.instance.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_1 = new lib.CachedBmp_2();
		this.instance_1.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_2 = new lib.CachedBmp_3();
		this.instance_2.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_3 = new lib.CachedBmp_4();
		this.instance_3.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_4 = new lib.CachedBmp_5();
		this.instance_4.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_5 = new lib.CachedBmp_6();
		this.instance_5.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_6 = new lib.CachedBmp_7();
		this.instance_6.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_7 = new lib.CachedBmp_8();
		this.instance_7.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_8 = new lib.CachedBmp_9();
		this.instance_8.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_9 = new lib.CachedBmp_10();
		this.instance_9.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_10 = new lib.CachedBmp_11();
		this.instance_10.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_11 = new lib.CachedBmp_12();
		this.instance_11.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_12 = new lib.CachedBmp_13();
		this.instance_12.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_13 = new lib.CachedBmp_14();
		this.instance_13.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_14 = new lib.CachedBmp_15();
		this.instance_14.setTransform(117.1, 182.05, 0.5, 0.5);

		this.instance_15 = new lib.CachedBmp_16();
		this.instance_15.setTransform(117.1, 182.05, 0.5, 0.5);

		this.timeline.addTween(cjs.Tween.get({}).to({ state: [{ t: this.instance }] }).to({ state: [{ t: this.instance_1 }] }, 4).to({ state: [{ t: this.instance_2 }] }, 4).to({ state: [{ t: this.instance_3 }] }, 4).to({ state: [{ t: this.instance_4 }] }, 4).to({ state: [{ t: this.instance_5 }] }, 4).to({ state: [{ t: this.instance_6 }] }, 4).to({ state: [{ t: this.instance_7 }] }, 4).to({ state: [{ t: this.instance_8 }] }, 4).to({ state: [{ t: this.instance_9 }] }, 4).to({ state: [{ t: this.instance_10 }] }, 4).to({ state: [{ t: this.instance_11 }] }, 4).to({ state: [{ t: this.instance_12 }] }, 4).to({ state: [{ t: this.instance_13 }] }, 4).to({ state: [{ t: this.instance_14 }] }, 4).to({ state: [{ t: this.instance_15 }] }, 4).wait(4));

		// Smileys
		this.instance_16 = new lib.Symbol1("synched", 0);

		this.instance_17 = new lib.Symbol5("synched", 0);
		this.instance_17._off = true;

		this.timeline.addTween(cjs.Tween.get(this.instance_16).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4));
		this.timeline.addTween(cjs.Tween.get(this.instance_17).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).to({ _off: true }, 4).wait(4).to({ _off: false }, 0).wait(4));

		this._renderFirstFrame();

	}).prototype = p = new lib.AnMovieClip();
	p.nominalBounds = rect = new cjs.Rectangle(396.9, 296.9, 806.1, 604.9);
	p.frameBounds = [rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect, rect];
	// library properties:
	lib.properties = {
		id: '8B13EBF7E505974C875B1E554193CF69',
		width: 800,
		height: 600,
		fps: 12,
		color: "#FFFFFF",
		opacity: 1.00,
		manifest: [
			{ src: "images/YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1.png", id: "YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_1" },
			{ src: "images/YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2.png", id: "YouAreAnIdiot_html5_conversion_via_Adobe_Animate_atlas_2" },
			{ src: "sounds/sound4.mp3", id: "sound4" }
		],
		preloads: []
	};



	// bootstrap callback support:

	(lib.Stage = function (canvas) {
		createjs.Stage.call(this, canvas);
	}).prototype = p = new createjs.Stage();

	p.setAutoPlay = function (autoPlay) {
		this.tickEnabled = autoPlay;
	}
	p.play = function () { this.tickEnabled = true; this.getChildAt(0).gotoAndPlay(this.getTimelinePosition()) }
	p.stop = function (ms) { if (ms) this.seek(ms); this.tickEnabled = false; }
	p.seek = function (ms) { this.tickEnabled = true; this.getChildAt(0).gotoAndStop(lib.properties.fps * ms / 1000); }
	p.getDuration = function () { return this.getChildAt(0).totalFrames / lib.properties.fps * 1000; }

	p.getTimelinePosition = function () { return this.getChildAt(0).currentFrame / lib.properties.fps * 1000; }

	an.bootcompsLoaded = an.bootcompsLoaded || [];
	if (!an.bootstrapListeners) {
		an.bootstrapListeners = [];
	}

	an.bootstrapCallback = function (fnCallback) {
		an.bootstrapListeners.push(fnCallback);
		if (an.bootcompsLoaded.length > 0) {
			for (var i = 0; i < an.bootcompsLoaded.length; ++i) {
				fnCallback(an.bootcompsLoaded[i]);
			}
		}
	};

	an.compositions = an.compositions || {};
	an.compositions['8B13EBF7E505974C875B1E554193CF69'] = {
		getStage: function () { return exportRoot.stage; },
		getLibrary: function () { return lib; },
		getSpriteSheet: function () { return ss; },
		getImages: function () { return img; }
	};

	an.compositionLoaded = function (id) {
		an.bootcompsLoaded.push(id);
		for (var j = 0; j < an.bootstrapListeners.length; j++) {
			an.bootstrapListeners[j](id);
		}
	}

	an.getComposition = function (id) {
		return an.compositions[id];
	}


	an.makeResponsive = function (isResp, respDim, isScale, scaleType, domContainers) {
		var lastW, lastH, lastS = 1;
		window.addEventListener('resize', resizeCanvas);
		resizeCanvas();
		function resizeCanvas() {
			var w = lib.properties.width, h = lib.properties.height;
			var iw = window.innerWidth, ih = window.innerHeight;
			var pRatio = window.devicePixelRatio || 1, xRatio = iw / w, yRatio = ih / h, sRatio = 1;
			if (isResp) {
				if ((respDim == 'width' && lastW == iw) || (respDim == 'height' && lastH == ih)) {
					sRatio = lastS;
				}
				else if (!isScale) {
					if (iw < w || ih < h)
						sRatio = Math.min(xRatio, yRatio);
				}
				else if (scaleType == 1) {
					sRatio = Math.min(xRatio, yRatio);
				}
				else if (scaleType == 2) {
					sRatio = Math.max(xRatio, yRatio);
				}
			}
			domContainers[0].width = w * pRatio * sRatio;
			domContainers[0].height = h * pRatio * sRatio;
			domContainers.forEach(function (container) {
				container.style.width = w * sRatio + 'px';
				container.style.height = h * sRatio + 'px';
			});
			stage.scaleX = pRatio * sRatio;
			stage.scaleY = pRatio * sRatio;
			lastW = iw; lastH = ih; lastS = sRatio;
			stage.tickOnUpdate = false;
			stage.update();
			stage.tickOnUpdate = true;
		}
	}
	an.handleSoundStreamOnTick = function (event) {
		if (!event.paused) {
			var stageChild = stage.getChildAt(0);
			if (!stageChild.paused || stageChild.ignorePause) {
				stageChild.syncStreamSounds();
			}
		}
	}


})(createjs = createjs || {}, AdobeAn = AdobeAn || {});
var createjs, AdobeAn;