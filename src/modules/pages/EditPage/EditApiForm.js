import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, formValueSelector, reduxForm } from 'redux-form';

import block from '../../../helpers/bem-cn';
import transformFormValues from '../../../helpers/transformFormValues';

import Section from '../../Layout/Section/Section';
import Title from '../../Layout/Title/Title';
import Subtitle from '../../Layout/Title/Subtitle';
import Row from '../../Layout/Row/Row';
import Input from '../../inputs/Input';
import Radio from '../../inputs/Radio/Radio';
import Label from '../../labels/Label';
import Hint from '../../labels/Hint/Hint';
import MultiSelect from '../../selects/MultiSelect/MultiSelect';
import Button from '../../buttons/Button';
import Icon from '../../Icon/Icon';

import FormRow from '../../forms/FormRow';
import FormInput from '../../forms/FormInput/FormInput';
import FormLabel from '../../forms/FormLabel';

import RenderPlugins from '../../forms/plugins/RenderPlugins';

const b = block('j-api-form');

const propTypes = {
    api: PropTypes.object.isRequired,
    apiSchema: PropTypes.object.isRequired,
    excludePlugin: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    selectPlugin: PropTypes.func.isRequired,
    selectedPlugins: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const ApiForm = (props) => {
    // console.error('THIS>PROPS', props);
    const {
        apiSchema,
        excludePlugin,
        initialValues,
        handleSubmit,
        plugins,
        response,
        selectPlugin,
        selectedPlugins,
    } = props;
    const parse = value => (value === undefined ? undefined : parseInt(value));
    const includePlugin = value => {
        // console.clear();
        apiSchema.plugins.map((plugin, index) => {
            if (plugin.name === value.value && !selectedPlugins.includes(plugin.name)) {
                selectPlugin(plugin.name);
            }
        });
    };
    const removePlugin = value => {
        excludePlugin(value);
    };

    const getValues = key => {
        // console.warn('/_/_/_/ VALUES /_/_/_/', initialValues.proxyß[key]);
        return initialValues.proxy[key];
    };

    const optionsTransformer = config => {
        const opts = config.map(item => ({
            label: item,
            value: item,
        }));

        return opts;
    };
    // console.error('=========++>', initialValues.proxy.methods);

    return (
        <form className={b} onSubmit={handleSubmit}>
            <Section>
                <Row>
                    <Title>Edit API</Title>
                    <div className="j-buttons__wrapper">
                        <Link
                            to={'/'}
                            onClick={() => {
                                props.handleDelete(props.api.name);
                            }}
                        >
                            <Button
                                type="button"
                                mod="danger"
                            >
                                <Icon type="delete-white" />
                                Delete
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            mod="primary"
                        >
                            Save
                        </Button>
                    </div>
                </Row>
            </Section>
            <div className={b('inner')}>
                <div className={b('section')}>
                    <div className={b('section-title')}>1. General</div>
                    <Row className={b('row')()} fullwidth>
                        <Row col>
                            <Label>API Name</Label>
                            <Field
                                name="name"
                                type="text"
                                component={Input}
                                disabled={props.disabled}
                            />
                        </Row>
                        <Row col>
                            <Label>Is Active?</Label>
                            <Row className={b('radio-wrap')()}>
                                <Row className={b('radio')()}>
                                    <Field
                                        name="active"
                                        component={Radio}
                                        value={'true'}
                                        type="radio"
                                        id="is-active"
                                    />
                                    <Label htmlFor="is-active">Yes</Label>
                                </Row>
                                <Row className={b('radio')()}>
                                    <Field
                                        name="active"
                                        component={Radio}
                                        value={'false'}
                                        type="radio"
                                        id="is-not-active"
                                    />
                                    <Label htmlFor="is-not-active">No</Label>
                                </Row>
                            </Row>
                        </Row>
                    </Row>
                </div>
                <div className={b('section')}>
                    <div className={b('section-title')}>2. Proxy</div>
                    <Row className={b('row')()} fullwidth>
                        <Row col>
                            <Label>Listen Path</Label>
                            <Field
                                name="proxy.listen_path"
                                type="text"
                                placeholder="eg. http://gw.hellofresh.com/"
                                component={Input}
                            />
                            <Hint>The public url that is exposed by the Gateway</Hint>
                        </Row>
                        <Row col>
                            <Label>Upstream URL</Label>
                            <Field
                                name="proxy.upstream_url"
                                type="text"
                                component={Input}
                            />
                            <Hint>The url to which the Gateway forwards requests made to the public url.</Hint>
                        </Row>
                    </Row>
                    <Row className={b('row')()} fullwidth>
                        <Row col>
                            <Label>Methods</Label>
                            <Field
                                name="proxy.methods"
                                type="text"
                                placeholder="Choose one or more methods"
                                edit
                                value={getValues('methods')}
                                options={optionsTransformer(apiSchema.proxy.methods)}
                                component={MultiSelect}
                            />
                            <Hint>HTTP methods that are supported for the endpoint.</Hint>
                        </Row>
                        <Row col>
                            <Label>Preserve Host?</Label>
                            <Row className={b('radio-wrap')()}>
                                <Row className={b('radio')()}>
                                    <Field
                                        name="proxy.preserve_host"
                                        component={Radio}
                                        value={'true'}
                                        type="radio"
                                        id="preserve-host-true"
                                    />
                                    <Label htmlFor="preserve-host-true">Yes</Label>
                                </Row>
                                <Row className={b('radio')()}>
                                    <Field
                                        name="proxy.preserve_host"
                                        component={Radio}
                                        value={'false'}
                                        type="radio"
                                        id="preserve-host-false"
                                    />
                                    <Label htmlFor="preserve-host-false">No</Label>
                                </Row>
                            </Row>
                            <Hint>Preserve the host header the client used for the incoming request.</Hint>
                        </Row>
                    </Row>
                    <Row className={b('row')()} fullwidth>
                        <Row col>
                            <Label>Append Path?</Label>
                            <Row className={b('radio-wrap')()}>
                                <Row className={b('radio')()}>
                                    <Field
                                        name="proxy.append_path"
                                        component={Radio}
                                        value={'true'}
                                        type="radio"
                                        id="append-path-true"
                                    />
                                    <Label htmlFor="append-path-true">Yes</Label>
                                </Row>
                                <Row className={b('radio')()}>
                                    <Field
                                        name="proxy.append_path"
                                        component={Radio}
                                        value={'false'}
                                        type="radio"
                                        id="append-path-false"
                                    />
                                    <Label htmlFor="append-path-false">No</Label>
                                </Row>
                            </Row>
                            <Hint>Appends the path from the listen_path when forwarding the request to the upstream_url.</Hint>
                        </Row>
                        <Row col>
                            <Label>Strips Path?</Label>
                            <Row className={b('radio-wrap')()}>
                                <Row className={b('radio')()}>
                                    <Field
                                        name="proxy.strip_path"
                                        component={Radio}
                                        value={'true'}
                                        type="radio"
                                        id="strip-path-true"
                                    />
                                    <Label htmlFor="strip-path-true">Yes</Label>
                                </Row>
                                <Row className={b('radio')()}>
                                    <Field
                                        name="proxy.strip_path"
                                        component={Radio}
                                        value={'false'}
                                        type="radio"
                                        id="strip-path-false"
                                    />
                                    <Label htmlFor="strip-path-false">No</Label>
                                </Row>
                            </Row>
                            <Hint> Strip the path out of the listen_path when forwarding the request to the upstream_url.</Hint>
                        </Row>
                    </Row>
                </div>
                <div className={b('section')}>
                    <div className={b('section-title')}>3. Health check</div>
                    <Row className={b('row')()} fullwidth>
                        <Row col>
                            <Label>Health URL (optional)</Label>
                            <Field
                                name="health_check.url"
                                type="text"
                                placeholder="eg. http://gw.hellofresh.com/"
                                component={Input}
                            />
                            <Hint>The url that the Gateway will use to determine the health of the API. </Hint>
                        </Row>
                        <Row col>
                            <Label>Timeout (optional)</Label>
                            <Field
                                name="health_check.timeout"
                                type="number"
                                parse={parse}
                                component={Input}
                            />
                            <Hint>The length of time that the Gateway should wait before displaying an error.</Hint>
                        </Row>
                    </Row>
                </div>
                <div className={b('section')}>
                    <div className={b('section-title')}>4. Plugins</div>

                    {
                        !!plugins &&
                            <RenderPlugins
                                className={b()}
                                apiSchema={apiSchema}
                                plugins={plugins}
                                initialValues={initialValues}
                                selectedPlugins={selectedPlugins}
                                handlePluginInclude={includePlugin}
                                handlePluginExclude={removePlugin}
                                response={response}
                                edit
                            />
                    }

                </div>
            </div>

            <Row className={b('row',{ 'button-row': true })()}>
                <Button
                    type="submit"
                    mod="primary"
                >
                    Save
                </Button>
            </Row>
        </form>
    );
};

ApiForm.propTypes = propTypes;

const selector = formValueSelector('apiForm');

const form = reduxForm({
    form: 'apiForm',
    enableReinitialize: true, // this is needed!!
})(ApiForm);

export default connect(
    state => {
        const plugins = selector(state, 'plugins');

        const api = state.apiReducer.api;
        const apiPlugins = api.plugins;
        const defaultPlugins = state.apiReducer.apiSchema.plugins;

        const updatedPlugins = defaultPlugins.map(item => {
            const res = apiPlugins.filter(pl => pl.name === item.name);

            return res.length > 0 ? res[0] : item;
        });

        const lens = R.lensPath(['plugins']);
        // substitude the plugin.config.limit
        const updatedApi = R.set(lens, updatedPlugins, api);
        // const x = api.plugins.map((item, index) => item.name === )
        // console.warn('____', transformFormValues(api).plugins);
        // console.warn('____', state.apiReducer.api);
        // console.warn(updatedApi)

        // console.error(defaultPlugins);
        // console.log(apiPlugins);
        // console.warn(updatedPlugins);

        return {
            // initialValues: transformFormValues(state.apiReducer.api),
            initialValues: transformFormValues(updatedApi),
            // ***FOR SOME REASON NAME of the plugin DISCARDS while saving
            apiSchema: state.apiReducer.apiSchema,
            response: state.apiReducer.response,
            selectedPlugins: state.apiReducer.selectedPlugins,
            keepDirtyOnReinitialize: false,
            plugins,
        };
    },
    null,
)(form);
