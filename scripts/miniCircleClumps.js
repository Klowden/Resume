var canvas = document.querySelector("canvas")

const setCanvasSize = () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
}

setCanvasSize()

var c = canvas.getContext("2d")

//max radius of circle objects
var maxRadius = 40
var minRadius = 4

//create mouse object for eventlistener
var mouse = {
	x: undefined,
	y: undefined,
}

// create color array for variance in color
var colorArray = ["#1E3259", "#1A2A82", "#6E5E12", "#F2D129", "#D9BB25"]

//Event Listener - mouse position
window.addEventListener("mousemove", function (event) {
	mouse.x = event.x
	mouse.y = event.y
})

// Event Listener - screen resize
window.addEventListener("resize", function () {
	setCanvasSize()
	//IF eventListener stops here - anything moving on screen will slowly migrate to fill the new space instead of being dynamically generated

	//init runs generation of new circles
	init()
})

///// Scrolling Functions for circle Array

// Store the initial scroll position
var initialScrollY = window.scrollY
var initialScrollX = window.scrollX

// Variables to track scroll changes
var scrollDeltaX = 0
var scrollDeltaY = 0

// Flag to track scrolling state
var isScrolling = false

// Add a scroll event listener to detect scrolling
window.addEventListener("scroll", function () {
	// Calculate the change in scroll position since the last frame
	scrollDeltaY = window.scrollY - initialScrollY
	scrollDeltaX = window.scrollX - initialScrollX

	// Update the initial scroll positions
	initialScrollY = window.scrollY
	initialScrollX = window.scrollX

	// Set the scrolling flag to true during a scroll event
	isScrolling = true

	// Clear the scrolling flag after a short delay (e.g., 100 milliseconds)
	clearTimeout(scrollTimeout)
	var scrollTimeout = setTimeout(function () {
		isScrolling = false
	}, 100)
})

// Mouse click event listener
window.addEventListener("click", function (event) {
	// Iterate through the circleArray and calculate the direction vector
	for (var i = 0; i < circleArray.length; i++) {
		var circle = circleArray[i]
		var dx = circle.x - event.clientX
		var dy = circle.y - event.clientY
		var distance = Math.sqrt(dx * dx + dy * dy)
		var maxDistance = 100 // Adjust this value to control the explosion strength
		var explosionDuration = 500 // Adjust this value for the duration of the explosion effect (in milliseconds)

		if (distance < maxDistance) {
			// Calculate the normalized direction vector
			var directionX = dx / distance
			var directionY = dy / distance

			// Apply a temporary velocity change in the direction away from the click
			circle.tempDx = (directionX * maxDistance) / distance
			circle.tempDy = (directionY * maxDistance) / distance

			// Set a timeout to revert the velocity change after the specified duration
			setTimeout(function () {
				circle.tempDx = 0
				circle.tempDy = 0
			}, explosionDuration)
		}
	}
})

//Function to draw circle (ease of coding)
function Circle(x, y, dx, dy, radius) {
	//declare variables unique to each circle
	this.x = x
	this.y = y
	this.dx = dx
	this.dy = dy
	this.radius = radius
	this.minRadius = radius
	this.tempDx = 0 // Initialize tempDx
	this.tempDy = 0
	//set color of each circle
	this.color = colorArray[Math.floor(Math.random() * colorArray.length)]

	//draw function
	this.draw = function () {
		// //arc / circle
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		// c.strokeStyle ='blue';
		// c.stroke();
		c.fillStyle = this.color
		c.fill()
	}

	//modify where each circle is drawn each frame
	this.update = function () {
		//to change direction of animation when edge of screen is hit
		if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
			this.dx = -this.dx
		}

		if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
			this.dy = -this.dy
		}

		//incredment dx & dy to cause frame position of circle to move
		this.x += this.dx
		this.y += this.dy

		//interactivity
		//growth of circles based on distance from mouse
		if (
			mouse.x - this.x < 50 &&
			mouse.x - this.x > -50 &&
			mouse.y - this.y < 50 &&
			mouse.y - this.y > -50
		) {
			if (this.radius < maxRadius) {
				this.radius += 1
			}
		} else if (this.radius > this.minRadius) {
			this.radius -= 1
		}

		// Check if a scroll event is currently happening
		if (isScrolling) {
			// Update the circle's x and y positions by the exact changes in x and y during the scroll event
			this.x -= scrollDeltaX
			this.y -= scrollDeltaY
		}

		// Apply temporary velocity change
		this.x += this.tempDx
		this.y += this.tempDy

		// Revert to original velocity gradually (you can adjust the rate of change)
		this.tempDx *= 0.95 // Gradually reduce the temporary velocity
		this.tempDy *= 0.95

		// Wrap the circles around the screen edges
		if (this.x + this.radius < 0) {
			this.x = innerWidth + this.radius
		} else if (this.x - this.radius > innerWidth) {
			this.x = -this.radius
		}
		if (this.y + this.radius < 0) {
			this.y = innerHeight + this.radius
		} else if (this.y - this.radius > innerHeight) {
			this.y = -this.radius
		}

		//call draw
		this.draw()
	}
}

//create circle array to store multiple circles
var circleArray = []

//initialize function to start/refresh code
function init() {
	//empty the circleArray to prevent infinite addition to array on resize
	circleArray = []

	//create multiple circles
	for (var i = 0; i < 1600; i++) {
		//declare circle variables
		var x = Math.random() * (window.innerWidth - radius * 2) + radius //prevents spawning where the circle would be outside of the window at any point
		var dx = (Math.random() - 0.5) * 3 //Velocity (number to add each fram (px))
		var y = Math.random() * (window.innerHeight - radius * 2) + radius
		var dy = (Math.random() - 0.5) * 3 //y velocity
		var radius = Math.random() * 3 + 3

		circleArray.push(new Circle(x, y, dx, dy, radius))
	}
}

//Animate function intro
//animate frames
function animate() {
	//create Loop
	requestAnimationFrame(animate)

	//clear canvas
	c.clearRect(0, 0, innerWidth, innerHeight)

	//circle update function - draws circle each frame
	for (var i = 0; i < circleArray.length; i++) {
		circleArray[i].update()
	}
}

//call initial init() function
init()

//call animate function
animate()
