# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: "Plastic Anthony"
	author: "Lachlan Kermode"
	twitter: ""
	description: ""

# Imports, Constants
{TextLayer} = require "TextLayer"

red = "#D3141C"
lightRed = 'rgba(211,20,28, 0.1)'
darkRed = "#A81017"
darkGray = "#BEBEBE"
lightGray = "#F7F7F7"
white = "#FFF"
black = "#000"
clear = "transparent"

navHeight = 60
sPad = 10
gu = Screen.width / 8

createButton = (text, onClickHandler) ->
	button = new Layer
		parent: page1
		width: (1.5*gu)
		height: (gu/3)
		backgroundColor: darkRed
	buttonText = new TextLayer
		parent: button
		text: text
		fontSize: '14pt'
		fontFamily: "'Exo', sans-serif"
		letterSpacing: 4
		fontWeight: 800
		color: white
		height: 35
		width: button.width
		textAlign: 'center'
		y: Align.center
	button.onClick ->
		onClickHandler()
	return button
# Nav
nav = new Layer
	height: navHeight
	width: Screen.width
	backgroundColor: darkRed

navIcon = new Layer
	parent: nav
	height: navHeight - 30
	width: navHeight - 30
	x: Align.left(gu + sPad)
	y: 15
	image: "images/white-a.png"

logoutTab = new TextLayer
	parent: nav
	text: "logout"
	color: white
	fontFamily: "'Indie Flower', cursive"
	fontSize: 24
	x: Align.right(-gu)
	y: Align.center
	height: 24
	width: 70
# Pages

# Create PageComponent
pageScroller = new PageComponent
	point: Align.center
	x: gu
	y: navHeight
	width: Screen.width - (2*gu)
	height: Screen.height  - navHeight
	scrollVertical: false
# 	scrollHorizontal: false

# Function to create pages
createPage = (index) ->
	page = new Layer
		name: "page#{index}"
		size: pageScroller.size
		x: (pageScroller.width) * (index-1)
		backgroundColor: clear
		parent: pageScroller.content
	return page
# Pages need to be explicit variables to be referenced
page1 = createPage(1)
page2 = createPage(2)
page3 = createPage(3)

# Home Screen (page1)

createTitle = (text) ->
	return new TextLayer
		parent: page1
		y: (2*sPad)
		height: 30
		width: page1.width/2 - sPad
		text: text
		textAlign: 'center'
		letterSpacing: 1
		fontFamily: "'Exo', sans-serif"
		fontSize: 24
		color: red
currentDatesTitle = createTitle('Current Dates')
	
createDate = (id, name, email) -> 
	dateHeight = 60
	container = new Layer
		parent: page1
		backgroundColor: lightGray
		y: (3*sPad + currentDatesTitle.height) + (id * (sPad + dateHeight))
		height: dateHeight
		width: page1.width / 2 - sPad
		borderRadius: 5
	name = new TextLayer
		parent: container
		text: name
		x: sPad
		y: sPad
		width: container.width/2
		fontFamily: "'Exo', sans-serif"
		color: black
	email = new TextLayer
		parent: container
		text: email
		x: Align.right(-sPad)
		y: Align.top(sPad)
		textAlign: 'right'
		height: container.height
		width: container.width/2
		fontFamily: "'Exo', sans-serif"
		color: darkGray
	# details
	details = new Layer
		parent: container
		y: container.height
		height: dateHeight/2
		width: container.width
		backgroundColor: lightRed
		opacity: 0
	emailButton = new Layer
		parent: details
		height: details.height
		width: details.width/2
		x: Align.left
		backgroundColor: 'transparent'
	emailText = new TextLayer
		parent: emailButton
		fontFamily: "'Exo', sans-serif"
		fontWeight: 'bold'
		color: black
		text: 'Email this rushee'
		height: 23
		width: emailButton.width
		textAlign: 'center'
		y: Align.center
	reportButton = new Layer
		parent: details
		height: details.height
		width: details.width/2
		x: Align.right
		backgroundColor: darkRed
	reportText = new TextLayer
		parent: reportButton
		fontFamily: "'Exo', sans-serif"
		fontWeight: 'bold'
		color: white
		text: 'Write a report'
		height: 23
		width: reportButton.width
		textAlign: 'center'
		y: Align.center
	# transitions
	container.states.add
		normal:
			height: dateHeight
		detail:
			height: dateHeight + details.height
	details.states.add
		normal:
			zIndex: -1
			opacity: 0
		detail:
			opacity: 1
	
	reportButton.onClick ->
		pageScroller.snapToPage(page2)
	container.onClick ->
		container.bringToFront()
		container.states.next('detail', 'normal')
		Utils.delay 0.5, ->
			details.states.next('detail', 'normal')
	return container

d1 = createDate(0, 'Johnny Someone', 'johhny@gmail.com')
d2 = createDate(1, 'Harry Allbreeze', 'allbreeze@gmail.com')
d3 = createDate(2, 'Delilah Methinks', 'sneakybitch@gmail.com')
	

# Capacity
capLabel = createTitle('Capacity')
capLabel.y = (2*sPad)
capLabel.x = Align.right

capContainer = new Layer
	parent: capLabel
	y: capLabel.height + sPad
	backgroundColor: lightGray
	width: page1.width/2 - sPad
	height: 90

capNum = new TextLayer
	parent: capContainer
	x: Align.center
	y: Align.center
	text: "3"
	height: 60
	width: 80
	color: darkGray
	fontFamily: "'Exo', sans-serif"
	fontWeight: 'bold'
	fontSize: 60

capMinus = new Layer
	parent: capContainer
	x: Align.left
	y: Align.center
	width: 90
	height: 90
	image: 'images/minus-red.png'

capPlus = new Layer
	parent: capContainer
	x: Align.right(-sPad*2)
	y: Align.center
	width: 40
	height: 40
	image: 'images/plus-icon-red.png'

# Friends
friendsTitle = createTitle('Friends')
friendsTitle.x = Align.right
friendsTitle.y = capContainer.y + capContainer.height + (sPad*3)
friendsContainer = new Layer
	parent: page1
	backgroundColor: lightGray
	x: page1.width/2 + sPad
	y: friendsTitle.y + friendsTitle.height + sPad
	width: page1.width/2 - sPad
	height: (1.5*gu)
	borderRadius: 5
friendsTable = new Layer
	parent: friendsContainer
	backgroundColor: clear
	y: (sPad*2)
	x: Align.left(sPad*2)
	width: (gu*2) - (sPad*4)
	html: '''
	<div class="date-container">
		<h5>JOHNNY BEGOOD</h5>
		<h5>SAM SMITH</h5>
		<h5>HOPE GRASSBED</h5>
		<h5>HYUN XIAO</h5>
		<h5>GIULIA IZZO</h5>
		<h5>DELILAH YESOD</h5>
	</div>
	'''
plusIcon = new Layer
	parent: friendsContainer
	x: Align.right(-sPad*2)
	y: Align.bottom(-sPad*2)
	width: 40
	height: 40
	image: "images/plus-icon-red.png"

# Completed Dates
completedTitle = createTitle('Completed Dates')
completedTitle.x = Align.right
completedTitle.y = friendsContainer.y + friendsContainer.height + (2*sPad)
completedContainer = new Layer
	parent: page1
	backgroundColor: lightGray
	x: completedTitle.x
	y: completedTitle.y + completedTitle.height + sPad
	width: page1.width / 2 - sPad
	height: (1*gu)
	borderRadius: 5
completedTable = new Layer
	parent: completedContainer
	backgroundColor: clear
	y: (sPad*2)
	x: Align.left(sPad*2)
	width: (gu*2) - (sPad*4)
	html: '''
	<div class="date-container">
		<h5>Saffron Paintheaded</h5>
		<h5>Gemima Labella</h5>
	</div>
	'''


# Report Part 1 (page2)
divider = 70

createQTitle = (text, y) ->
	return new TextLayer
		parent: page2
		y: y || (2*sPad)
		height: 30
		width: page2.width
		text: text
		textAlign: 'left'
		fontFamily: "'Exo', sans-serif"
		fontSize: 16
		color: red

createRateQ = (text, y) ->
  title = createQTitle(text, y)
  radio = new Layer
    parent: title
    y: title.height
    height: (divider - 14) - title.height
    width: title.width
    backgroundColor: lightGray
  return title
 
 createShortA = (text, y) ->
 	title = createQTitle(text, y)
 	inputContainer = new Layer
 		parent: title
 		y: title.height
 		height: (divider - 14) - title.height
 		width: title.width
 		backgroundColor: 'transparent'
 	input = new Layer
 		parent: inputContainer
 		backgroundColor: 'transparent'
 		height: inputContainer.height
 		width: inputContainer.width / 4
 		html: '''
 		<input placeholder="Sex">
 		'''

q1 = createRateQ('General vibes of coffee date.', divider)
q2 = createRateQ('Potential contributions of this rushee to meeting. This refers to LD and PB', 2*divider)
q3 = createRateQ("Enthusiasm of this rushee for A's gatherings outside of meeting. Estimated activity in the A's community.", 3*divider)
q4 = createRateQ('Did you feel like this rushee was being genuinely honest and open during the coffee date?', 4*divider)
q5 = createRateQ('To what extent did the rushee respectfully listen and engage with who you are?', 5*divider)

sq1 = createShortA('One word to describe rushee.', 6*divider)
sq1 = createShortA('One word to describe coffee date.', 7*divider)
sq1 = createShortA("Are there any extenuating external circumstances that you think played a role in your coffee date? (i.e. tired, grumpy, stressed, jubilant, manic, etc)", 8*divider)

nextButton = createButton('Next', () ->
	pageScroller.snapToPage(page3)
)
nextButton.parent = page2
nextButton.y = Align.bottom(-100)
nextButton.x = Align.center
# Report Part 2 (page3)
diatribeTitle = createTitle('The Real Report')
diatribeTitle.parent = page3
diatribeTitle.width = page3.width

diatribeSub = createQTitle('This should be around 1/2 page of typing. Why do you think this person is rushing? Was there anything that stood out to you during your coffee date? Was there anything that rubbed you the wrong way? Can you provide examples of openness and honesty. How well can this person keep a secret?')
diatribeSub.parent = page3
diatribeSub.y = diatribeTitle.y + diatribeTitle.height + sPad
diatribeSub.color = black
diatribeSub.height = 70

dTextArea = new Layer
	parent: page3
	y: diatribeSub.y + diatribeSub.height
	width: page3.width
	height: 550
	borderColor: red
	borderWidth: 2
	backgroundColor: 'transparent'
	html: '''
	<textarea >
	'''

submitButton = createButton('Submit', () ->
	pageScroller.snapToPage(page1)
)
submitButton.parent = page3
submitButton.y = Align.bottom(-70)
submitButton.x = Align.center
