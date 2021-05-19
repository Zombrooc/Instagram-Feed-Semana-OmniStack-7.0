import React, { Component } from "react";
import Helmet from "react-helmet";
import api from "../services/api";
import socketIOClient from "socket.io-client";

import like from "../assets/like.svg";
import comment from "../assets/comment.svg";
import send from "../assets/send.svg";
import more from "../assets/more.svg";

import "./Feed.css";

class Feed extends Component {
  state = {
    feed: [],
  };

  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get("/posts");

    this.setState({ feed: response.data });
  }

  registerToSocket = () => {
    const socket = socketIOClient("http://localhost:3333");

    socket.on("post", (newPost) => {
      this.setState({
        feed: [newPost, ...this.state.feed],
      });
    });

    socket.on("like", (likedPost) => {
      this.setState({
        feed: this.state.feed.map((post) =>
          post._id === likedPost._id ? likedPost : post
        ),
      });
    });
  };

  handleLike = (id) => {
    console.log("chegou aqui");
    api.post(`/posts/${id}/like`);
  };

  render() {
    return (
      <>
        <Helmet title="Feed" />
        <section id="post-list">
          {this.state.feed.map((post) => {
            return (
              <article key={post._id}>
                <header>
                  <div className="user-info">
                    <span> {post.author} </span>
                    <span className="place"> {post.place}</span>
                  </div>
                  <img src={more} alt="Mais" />
                </header>
                {post.image.endsWith(".jpg") ? (
                  <img
                    src={`http://localhost:3333/files/${post.image}`}
                    alt=""
                  />
                ) : (
                  <video controls>
                    <source
                      src={`http://localhost:3333/files/${post.image}`}
                      alt=""
                    />
                  </video>
                )}

                <footer>
                  <div className="actions">
                    <button
                      type="button"
                      onClick={() => this.handleLike(post._id)}
                    >
                      <img src={like} alt="" />
                    </button>
                    <img src={comment} alt="" />
                    <img src={send} alt="" />
                  </div>
                  <strong> {post.likes} curtidas </strong>
                  <p>
                    {" "}
                    {post.description} <span> {post.hashtags} </span>
                  </p>
                </footer>
              </article>
            );
          })}
        </section>
      </>
    );
  }
}

export default Feed;
