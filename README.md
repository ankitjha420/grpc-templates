Can make changes to the paths below, use linux btw ->

protoc -I=. ./proto/calculator.proto --js_out=import_style=commonjs,binary:./server --grpc_out=./server --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`

# Unary API
# Server & Client Streaming APIs
# Bidirectional Streaming APIs
