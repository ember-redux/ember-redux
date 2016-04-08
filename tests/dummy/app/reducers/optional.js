export default function(combine) {
    return (state, action) => {
        window.invoked = true;
        return combine(state, action);
    };
}
