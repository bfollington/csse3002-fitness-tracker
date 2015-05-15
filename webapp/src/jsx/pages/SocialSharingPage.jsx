import {MainNavbar} from "components/MainNavbar.jsx";

export class SocialSharingPage extends React.Component {
    constructor() {

    }

    render() {

        var body = (
			<style>
				.fb-share-button span,
				.fb-share-button iframe {
					width: 55px! important;
					height: 20px! important;
				}

			</style>
			<script>
				var link = "http://i.imgur.com/3skvA.jpg";
				window.onload = function() {
					document.getElementById("share").innerHTML="<a href='https://twitter.com/share' class='twitter-share-button' data-url=\'"+link+"\' data-text='PRE-LOAD TEXT?' data-count='none'>Tweet</a><div class='fb-share-button' data-href=\'"+link+"\' data-layout='button'></div>";
					document.getElementById("img").innerHTML="<img src=\'"+link+"\' alt='Run Overview' style='width:304px;height:228px'>";
					!function(d,s,id){
						var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
						if(!d.getElementById(id)){
							js=d.createElement(s);
							js.id=id;js.src=p+'://platform.twitter.com/widgets.js';
							fjs.parentNode.insertBefore(js,fjs);
						}
					}
				(document, 'script', 'twitter-wjs');

				} 
			</script>
			<div id="fb-root"></div>
			<script>
			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=639542186146785";
				fjs.parentNode.insertBefore(js, fjs);
			}
			(document, 'script', 'facebook-jssdk'));
			</script>
            <div>  
                <div id="img">
                </div>
				<div id="share">
				</div>
			</div>
        );
		
		return (
            <div>
                <MainNavbar />
                {body}
            </div>
        );
    }
}