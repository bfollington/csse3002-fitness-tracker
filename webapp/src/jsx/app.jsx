import {Body} from 'Body.jsx';

window.app = { domRoot: document.getElementById('mount') };

const render = (component) => React.render(
    component,
    window.app.domRoot
);

render(<Body />);

