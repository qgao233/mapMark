/**
 * 深度克隆对象或数组
 * @param {*} source 要克隆的源数据
 * @returns {*} 克隆后的数据
 */
export function deepClone(source) {
    // 处理非对象或 null
    if (source === null || typeof source !== 'object') {
        return source;
    }

    // 处理日期对象
    if (source instanceof Date) {
        return new Date(source.getTime());
    }

    // 处理数组
    if (Array.isArray(source)) {
        const clone = [];
        for (let i = 0; i < source.length; i++) {
            clone[i] = deepClone(source[i]);
        }
        return clone;
    }

    // 处理普通对象
    const clone = {};
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            clone[key] = deepClone(source[key]);
        }
    }
    return clone;
}

// 测试用例
function test() {
    const original = {
        string: 'hello',
        number: 123,
        boolean: true,
        null: null,
        undefined: undefined,
        array: [1, 2, { a: 3 }],
        date: new Date(),
        object: { b: 4 },
        tags: ['tag1', 'tag2']
    };

    const cloned = deepClone(original);
    console.log('Original:', original);
    console.log('Cloned:', cloned);
    console.log('Is array same?', original.array === cloned.array);
    console.log('Is date same?', original.date === cloned.date);
    console.log('Is object same?', original.object === cloned.object);
    console.log('Is tags same?', original.tags === cloned.tags);
}

export default {
    deepClone
}
