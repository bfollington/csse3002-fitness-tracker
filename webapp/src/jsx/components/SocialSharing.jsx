/**
 * Social sharing buttons that automatically trigger API requests
 * using the provided URL and message.
 */


/*
 * Example
 * <FacebookShareButton url="http://i.imgur.com/3skvA.jpg" />
 */
export class FacebookShareButton extends React.Component {
    constructor( props ) {
        super( props );
    }

    componentDidMount() {
        // Create and mount the button as per API instructions
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.3&appId=639542186146785";
            fjs.parentNode.insertBefore(js, fjs);
        }
        (document, 'script', 'facebook-jssdk'));
    }

    render() {
        // HTML as given in API
        return (
            <div className='fb-share-button'
                data-href={this.props.url}
                data-layout='button'>
            </div>
        )
    }
}

/*
 * Example
 * <TwitterShareButton url="http://i.imgur.com/3skvA.jpg" message="Sample body" />
 */
export class TwitterShareButton extends React.Component {
    constructor( props ) {
        super( props );
    }

    componentDidMount() {

        // Create and mount the button as per API instructions
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

    render() {
        // HTML as given in API
        return (
            <a href='https://twitter.com/share'
                className='twitter-share-button'
                data-url={this.props.url}
                data-text={this.props.message}
                data-count='none'>Tweet</a>
        )
    }
}
