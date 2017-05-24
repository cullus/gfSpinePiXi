/**
 * Skew Graphics
 * (based on PIXI 3.0.10)
 */


class SkewGraphics extends PIXI.Graphics {

	constructor() {

		super();

		// skew values
		this.skew = new PIXI.Point(0,0);

	}

	/**
	 * Override for skewing
	 */
	updateTransform () {

		// create some matrix refs for easy access
		let pt = this.parent.worldTransform;
		let wt = this.worldTransform;
		// temporary matrix variables
		let a, b, c, d, tx, ty;

		// check to see if the rotation is the same as the previous render. This means we only need to use sin and cos when rotation actually changes
		if (this.rotation !== this.rotationCache)
		{
			this.rotationCache = this.rotation;
			this._sr = Math.sin(this.rotation);
			this._cr = Math.cos(this.rotation);
		}
		// get the matrix values of the displayobject based on its transform properties..
		a  =  this._cr * this.scale.x;
		b  =  this._sr * this.scale.x;
		c  = -this._sr * this.scale.y;
		d  =  this._cr * this.scale.y;
		tx =  this.position.x;
		ty =  this.position.y;

		// check for pivot.. not often used so geared towards that fact!
		if (this.pivot.x || this.pivot.y)
		{
			tx -= this.pivot.x * a + this.pivot.y * c;
			ty -= this.pivot.x * b + this.pivot.y * d;
		}

		// check for skew ?
		if( this.skew.x !== 0 || this.skew.y !== 0 ) {

			const x = PIXI.DEG_TO_RAD * this.skew.x;
			const y = PIXI.DEG_TO_RAD * this.skew.y;

			const ma = a + c * y;
			const mb = b + d * y;
			const mc = c + a * x;
			const md = d + b * x;

			a = ma;
			b = mb;
			c = mc;
			d = md;
		}

		// concat the parent matrix with the objects transform.
		wt.a  = a  * pt.a + b  * pt.c;
		wt.b  = a  * pt.b + b  * pt.d;
		wt.c  = c  * pt.a + d  * pt.c;
		wt.d  = c  * pt.b + d  * pt.d;
		wt.tx = tx * pt.a + ty * pt.c + pt.tx;
		wt.ty = tx * pt.b + ty * pt.d + pt.ty;

		// multiply the alphas..
		this.worldAlpha = this.alpha * this.parent.worldAlpha;

		// reset the bounds each time this is called!
		this._currentBounds = null;

	}
}