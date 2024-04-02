document.addEventListener("DOMContentLoaded", function () {
	var phoneButton = document.getElementById("phone-btn")
	var infoPopup = document.getElementById("info-popup")

	// Function to toggle the display of the popup
	function togglePopup() {
		if (infoPopup.style.display === "block") {
			infoPopup.style.display = "none"
		} else {
			infoPopup.style.display = "block"
		}
	}

	// Click event for the phone button
	phoneButton.addEventListener("click", function (event) {
		// Prevents the click from propagating up to the document
		event.stopPropagation()
		togglePopup()
	})

	// Click event to hide the popup when clicking anywhere else on the page
	document.addEventListener("click", function (event) {
		if (event.target.id !== "phone-btn") {
			infoPopup.style.display = "none"
		}
	})
})
