import os

from app_config import Config
from flask_migrate import Migrate
from create_app import create_app
from flask_restful import Api
from database import db
from flask_cors import CORS

app = create_app(Config)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)
migrate = Migrate(app, db)


@app.route("/ping")
def test_connection():
    return "pong"


from api.signup import SignUp
from api.signin import SignIn
from api.user import User
from api.create_org import CreateOrganization
from api.create_post import CreatePost
from api.add_user import AddUser
from api.post import Post, Posts
from api.review import Review, Reviews
from api.create_review import CreateReview
from api.org import Organization, Organizations

# add api handless
api.add_resource(SignUp, "/api/signup")
api.add_resource(SignIn, "/api/signin")
api.add_resource(User, "/api/user/<user_id>")
api.add_resource(CreateOrganization, "/api/org")
api.add_resource(CreatePost, "/api/post")
api.add_resource(AddUser, "/api/add-user")
api.add_resource(Posts, "/api/posts")
api.add_resource(Post, "/api/post/<id>")
api.add_resource(CreateReview, "/api/review")
api.add_resource(Review, "/api/review/<id>")
api.add_resource(Reviews, "/api/reviews")
api.add_resource(Organization, "/api/org/<id>")
api.add_resource(Organizations, "/api/orgs")


# init app
if __name__ == "__main__":
    from waitress import serve

    port = int(os.environ.get("BACKEND_PORT", 5000))
    serve(app, host="0.0.0.0", port=port)
