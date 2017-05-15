var apiKey = "07422695-8c01-4822-a418-9a17fe71f330";
var apiUrl = "https://bpi.briteverify.com/emails.json";

window.simplysocial = (function() {
	var simplysocial = {
		init: function(view, q) {
			this.cleanUp();
			this.loadContent(view, q);
		},
		cleanUp: function() {
			$(".content .widget, .content .load-more").remove();
		},
		loadContent: function(view, q) {
			var $this = this;
			var posts = _.clone(data.posts);
			if (q != "all") {
				posts = _.filter(data.posts, function(o) { return o.type == q; });
			}

			_.forEach(posts, function(item, index) {
				var wigdet = $this.createWidget(item, view);
			});
		},
		createWidget: function(item, view) {
			var _class = (view == "list") ? "widget col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3" : "widget col-xs-6 col-sm-4";
			var $container = $("<div>", {"class": _class});
			var $post = $("<div>", {"class": "post clearfix"});
			var $profile_picture = $("<img>", {"src": "images/" + item.profilePicture});
			var $postContentContainer = $("<div>", {"class": "post-container"});
			var $postAuthor = $("<div>", {"class": "post-author"}).append(item.name);
			var $postContent = $("<div>", {"class": "post-content"}).append(item.content);
			var $postReplies = $("<div>", {"class": "post-replies"});
			var $postMedia = "";
			if (item.type != "text") {
				$postMedia = $("<div>", {"class": "post-media"}).append("<img src='" + item.media + "' alt='" + item.content + "'>");
				$postContent.append($("<a>", {"href": item.link, "target": "_blank", "title": item.link}).append(item.link));
			}
			if (_.isArray(item.replies)) {
				$postReplies.append($("<a>", {"href": "#", "title": "Expand"}).append("Expand <img src='images/arrowDown.png' alt='Expand'>"));
			}
			var $postActions = $("<div>", {"class": "post-actions"}).append(this.createActions(item));
			$postContentContainer.append($postActions)
								.append($postAuthor)
								.append($postContent)
								.append($postReplies);

			$post.append($profile_picture)
				.append($postContentContainer);
			$container.append($post)
					.append($postMedia);

			$(".content").append($container);
		},
		createActions: function(item) {
			return $("<ul>").append($("<li>").append("<a href='#' title='Share'><img src='images/shareIcon.png' alt='Share'></a>"))
							.append($("<li>").append("<a href='#' title='Like'><img src='images/likeIcon.png' alt='Like'></a>"))
							.append($("<li>").append(item.timeAgo));

		}
	};
	return simplysocial;
}());

$(function() {
	$(".calloutbox input").focus();
	simplysocial.init("list", "all");
	$(".calloutbox input").on("keydown", function() {
		var $this = $(this);
		if ($this.val().trim() == "What's on your mind?") {
			$this.val("");
		}
	}).on("blur", function() {
		var $this = $(this);
		if ($this.val().trim() == "") {
			$this.val("What's on your mind?").focus();
		}
	});
	$(".tabs li").on("click", function(e) {
		e.preventDefault();
		var $this = $(this);
		$(".tabs li").removeClass("active");
		$this.addClass("active");
		var filter = $this.attr("data-filter");
		simplysocial.init("list", filter);
	});
	$(".load-more").on("click", function(e) {
		e.preventDefault();
		simplysocial.loadContent("list", $(".tabs li.active").attr("data-filter"));
	});
	$(".add-post").on("click", function(e) {
		e.preventDefault();
		$(".new-post-modal").show();
		$(".new-user-modal").hide();
		$("#modal").css("height","250px");
		$("#modal, #modal-overlay").removeClass("closed");
	});
	$(".add-user").on("click", function(e) {
		e.preventDefault();
		$(".new-post-modal").hide();
		$(".new-user-modal").show();
		$("#modal").css("height","320px");
		$("#modal, #modal-overlay").removeClass("closed");
	});
	$(".close-button").on("click", function(e) {
		e.preventDefault();
		$("#modal, #modal-overlay").addClass("closed");
	});
	$(".new-user-modal input[type='button']").on("click", function() {
		var email = $("#email").val().trim();
		if (email.length > 0) {
			$.get(apiUrl + "?address=" + email + "&apikey=" + apiKey, function(data) {
				if (data.hasOwnProperty("status")) {
					if (data.status == "valid") {
						$("label[for='email']").removeClass("invalid").addClass("valid");
						$("#email").removeClass("invalid").addClass("valid");
					} else {
						$("label[for='email']").removeClass("valid").addClass("invalid");
						$("#email").removeClass("valid").addClass("invalid");
					}
				}
			}, "jsonp");
		} else {
			$("label[for='email']").removeClass("valid invalid");
			$("#email").removeClass("valid invalid");
		}
	});
	$("#email").on("keyup", function() {
		if ($(this).val().trim().length == 0) {
			$("label[for='email']").removeClass("valid invalid");
			$("#email").removeClass("valid invalid");
		}
	});
});
