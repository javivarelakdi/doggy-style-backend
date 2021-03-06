# README
​
# Project Name
​
Doggy Style Backend
​
## Description
​
Backend API for Doggy Style react app, which is a social network for dog owners who want to make connections with other dog owners in their neighbourhoods

## Instructions how to start

create `.env` file like the example `.env.sample`

start with `npm run start`​

Backend **http://localhost:5000**
​

## ROUTES Backend:

### Endpoints

| Method | Path                   | description           | Body |
| :----: | ---------------        | --------------------  | ---- |
|  GET   | `/users/:id`           | fetch user profile    |      |
|  GET   | `/users/`              | fetch users data      |      |
|  GET   | `/events/:id`          | fetch event profile   |      |
|  GET   | `/events/`             | fetch events data     |      |
|  POST  | `/events/new`          | create event          | `{ owner, name, description, location, date, initTime, endTime }` |
|  POST  | `/events/:id`          | Update event profile  | `{ name, description, location, date, initTime, endTime }` |
| DELETE | `/events/:id`          | Delete event profile  |      |
|  POST  | `/users/:id`           | Update profile        | `{ imgUrl, breed, birth, gender, about }` |
|  POST  | `users/favs/:targetUserId`  | adding favs      | `{ status }` | 
|  GET   | `/chats/`              | fetch chat list       |      |
|  POST  | `/chats/new`           | create chat           | `{targetUserId }`   |
|  GET   | `/chats/:id`           | fetch 1 chat data     |      |
|  PUT   | `/chats/:id`           | update 1 chat data    | `{content, senderId }`  |

### Auth endpoints

| Method | Path      | description    | Body                     |
| :----: | --------- | -------------- | ------------------------ |
|  GET   | `/whoami` | who am i       |                          |
|  POST  | `/signup` | signup a user  | `{ username, password, imgUrl, breed, birth, gender, about, lng, lat }` |
|  POST  | `/login`  | login a user   | `{ username, password, lng, lat }` |
|  GET   | `/logout` | logout session |                          |



## Models

### User model
​
{
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	imgUrl: String,
	breed: String,
	birth: Date,
	about: String,
	location: {type: Schema.Types.ObjectId, ref: 'Location'},
	gender: { type: String, enum: ['female', 'male', 'non-binary'] },
	favs:[{ type: Schema.Types.ObjectId, ref: 'User' }],
	fans:[{ type: Schema.Types.ObjectId, ref: 'User' }]
},
{ timestamps: true }

### Event model
​
{
	owner: { type: Schema.Types.ObjectId, ref: "User" },
	name: { type: String, required: true },
	description: String,
	location: { type: Schema.Types.ObjectId, ref: "Location" },
	date: { type: Date, required: true },
	initTime: { type: String, required: true },
	endTime: { type: String, required: true },
	attendees: [{ type: Schema.Types.ObjectId, ref: "User" }]
},
{ timestamps: true }

### Location model

{
	type: {
		type: String,
		enum: ['Point'],
		default: 'Point',
		required: true
	},
	coordinates: {
		type: [Number],
		required: true
	}
},
{ timestamps: true }

### Chat Room model

{
	users: [{ type: Schema.Types.ObjectId, ref: "User" }],
	messages: [{ type: Schema.Types.ObjectId, ref: "Message" }]
},
{ timestamps: true }

### Chat Message model

{
	sender: { type: Schema.Types.ObjectId, ref: "User" },
	content: String
},
{ timestamps: true }


### Git

The url to your repository and to your deployed project

[Repository Link](https://github.com/javivarelakdi/doggy-style-backend)





