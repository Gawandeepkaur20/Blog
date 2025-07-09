import models from "./model/index";
import { connect } from 'react-redux';

const _inject = (model_name, state) => {
    let props = state[model_name];
    for (let i in models[model_name]) {
        if (models[model_name].hasOwnProperty(i)) {
            props[i] = models[model_name][i];
        }
    }
    return props;
};

export const injectModels = model_names => {
    return Component => {
        let mapStateToProps = (state, ownProps) => {
            let props = {};
            model_names.forEach(model_name => {
                props[model_name] = _inject(model_name, state);
            });
            return props;
        };
        return connect(mapStateToProps)(Component);
    };
};


