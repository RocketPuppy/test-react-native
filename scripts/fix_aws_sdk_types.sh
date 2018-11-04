#!/usr/bin/env sh

echo "Node require() and react-native require() types conflict, so I'm commenting out the node type definition since this is a react-native environment."
echo "Node console() and react-native console() types conflict, so I'm commenting out the node type definition since this is a react-native environment."
echo "See tickets:"
echo -e "\thttps://github.com/DefinitelyTyped/DefinitelyTyped/issues/15960"
echo -e "\thttps://github.com/aws/aws-amplify/issues/281"
echo -e "\thttps://github.com/aws/aws-sdk-js/issues/1926"

sed -i"backup" "s/\(^declare var require: NodeRequire;\)/\/\/\1/g" "node_modules/@types/node/index.d.ts"
sed -i"backup" "s/\(^declare var console: Console;\)/\/\/\1/g" "node_modules/@types/node/index.d.ts"
