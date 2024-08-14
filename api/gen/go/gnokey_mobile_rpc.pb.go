// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.34.2
// 	protoc        (unknown)
// source: gnokey_mobile_rpc.proto

package _go

import (
	_go "github.com/gnolang/gnonative/api/gen/go"
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// The ErrCode enum defines errors for gRPC API functions. These are converted
// from the Go error types returned by gnoclient.
type ErrCode int32

const (
	// Undefined is the default value. It should never be set manually
	ErrCode_Undefined ErrCode = 0
	// TODO indicates that you plan to create an error later
	ErrCode_TODO ErrCode = 1
	// ErrNotImplemented indicates that a method is not implemented yet
	ErrCode_ErrNotImplemented ErrCode = 2
	// ErrInternal indicates an unknown error (without Code), i.e. in gRPC
	ErrCode_ErrInternal          ErrCode = 3
	ErrCode_ErrInvalidInput      ErrCode = 100
	ErrCode_ErrBridgeInterrupted ErrCode = 101
	ErrCode_ErrMissingInput      ErrCode = 102
	ErrCode_ErrSerialization     ErrCode = 103
	ErrCode_ErrDeserialization   ErrCode = 104
	ErrCode_ErrInitService       ErrCode = 105
	ErrCode_ErrRunGRPCServer     ErrCode = 153
)

// Enum value maps for ErrCode.
var (
	ErrCode_name = map[int32]string{
		0:   "Undefined",
		1:   "TODO",
		2:   "ErrNotImplemented",
		3:   "ErrInternal",
		100: "ErrInvalidInput",
		101: "ErrBridgeInterrupted",
		102: "ErrMissingInput",
		103: "ErrSerialization",
		104: "ErrDeserialization",
		105: "ErrInitService",
		153: "ErrRunGRPCServer",
	}
	ErrCode_value = map[string]int32{
		"Undefined":            0,
		"TODO":                 1,
		"ErrNotImplemented":    2,
		"ErrInternal":          3,
		"ErrInvalidInput":      100,
		"ErrBridgeInterrupted": 101,
		"ErrMissingInput":      102,
		"ErrSerialization":     103,
		"ErrDeserialization":   104,
		"ErrInitService":       105,
		"ErrRunGRPCServer":     153,
	}
)

func (x ErrCode) Enum() *ErrCode {
	p := new(ErrCode)
	*p = x
	return p
}

func (x ErrCode) String() string {
	return protoimpl.X.EnumStringOf(x.Descriptor(), protoreflect.EnumNumber(x))
}

func (ErrCode) Descriptor() protoreflect.EnumDescriptor {
	return file_gnokey_mobile_rpc_proto_enumTypes[0].Descriptor()
}

func (ErrCode) Type() protoreflect.EnumType {
	return &file_gnokey_mobile_rpc_proto_enumTypes[0]
}

func (x ErrCode) Number() protoreflect.EnumNumber {
	return protoreflect.EnumNumber(x)
}

// Deprecated: Use ErrCode.Descriptor instead.
func (ErrCode) EnumDescriptor() ([]byte, []int) {
	return file_gnokey_mobile_rpc_proto_rawDescGZIP(), []int{0}
}

type ErrDetails struct {
	state         protoimpl.MessageState
	sizeCache     protoimpl.SizeCache
	unknownFields protoimpl.UnknownFields

	Codes []ErrCode `protobuf:"varint,1,rep,packed,name=codes,proto3,enum=land.gno.gnokey_mobile.v1.ErrCode" json:"codes,omitempty"`
}

func (x *ErrDetails) Reset() {
	*x = ErrDetails{}
	if protoimpl.UnsafeEnabled {
		mi := &file_gnokey_mobile_rpc_proto_msgTypes[0]
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		ms.StoreMessageInfo(mi)
	}
}

func (x *ErrDetails) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*ErrDetails) ProtoMessage() {}

func (x *ErrDetails) ProtoReflect() protoreflect.Message {
	mi := &file_gnokey_mobile_rpc_proto_msgTypes[0]
	if protoimpl.UnsafeEnabled && x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use ErrDetails.ProtoReflect.Descriptor instead.
func (*ErrDetails) Descriptor() ([]byte, []int) {
	return file_gnokey_mobile_rpc_proto_rawDescGZIP(), []int{0}
}

func (x *ErrDetails) GetCodes() []ErrCode {
	if x != nil {
		return x.Codes
	}
	return nil
}

var File_gnokey_mobile_rpc_proto protoreflect.FileDescriptor

var file_gnokey_mobile_rpc_proto_rawDesc = []byte{
	0x0a, 0x17, 0x67, 0x6e, 0x6f, 0x6b, 0x65, 0x79, 0x5f, 0x6d, 0x6f, 0x62, 0x69, 0x6c, 0x65, 0x5f,
	0x72, 0x70, 0x63, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x12, 0x19, 0x6c, 0x61, 0x6e, 0x64, 0x2e,
	0x67, 0x6e, 0x6f, 0x2e, 0x67, 0x6e, 0x6f, 0x6b, 0x65, 0x79, 0x5f, 0x6d, 0x6f, 0x62, 0x69, 0x6c,
	0x65, 0x2e, 0x76, 0x31, 0x1a, 0x14, 0x67, 0x6e, 0x6f, 0x6e, 0x61, 0x74, 0x69, 0x76, 0x65, 0x74,
	0x79, 0x70, 0x65, 0x73, 0x2e, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x22, 0x46, 0x0a, 0x0a, 0x45, 0x72,
	0x72, 0x44, 0x65, 0x74, 0x61, 0x69, 0x6c, 0x73, 0x12, 0x38, 0x0a, 0x05, 0x63, 0x6f, 0x64, 0x65,
	0x73, 0x18, 0x01, 0x20, 0x03, 0x28, 0x0e, 0x32, 0x22, 0x2e, 0x6c, 0x61, 0x6e, 0x64, 0x2e, 0x67,
	0x6e, 0x6f, 0x2e, 0x67, 0x6e, 0x6f, 0x6b, 0x65, 0x79, 0x5f, 0x6d, 0x6f, 0x62, 0x69, 0x6c, 0x65,
	0x2e, 0x76, 0x31, 0x2e, 0x45, 0x72, 0x72, 0x43, 0x6f, 0x64, 0x65, 0x52, 0x05, 0x63, 0x6f, 0x64,
	0x65, 0x73, 0x2a, 0xe7, 0x01, 0x0a, 0x07, 0x45, 0x72, 0x72, 0x43, 0x6f, 0x64, 0x65, 0x12, 0x0d,
	0x0a, 0x09, 0x55, 0x6e, 0x64, 0x65, 0x66, 0x69, 0x6e, 0x65, 0x64, 0x10, 0x00, 0x12, 0x08, 0x0a,
	0x04, 0x54, 0x4f, 0x44, 0x4f, 0x10, 0x01, 0x12, 0x15, 0x0a, 0x11, 0x45, 0x72, 0x72, 0x4e, 0x6f,
	0x74, 0x49, 0x6d, 0x70, 0x6c, 0x65, 0x6d, 0x65, 0x6e, 0x74, 0x65, 0x64, 0x10, 0x02, 0x12, 0x0f,
	0x0a, 0x0b, 0x45, 0x72, 0x72, 0x49, 0x6e, 0x74, 0x65, 0x72, 0x6e, 0x61, 0x6c, 0x10, 0x03, 0x12,
	0x13, 0x0a, 0x0f, 0x45, 0x72, 0x72, 0x49, 0x6e, 0x76, 0x61, 0x6c, 0x69, 0x64, 0x49, 0x6e, 0x70,
	0x75, 0x74, 0x10, 0x64, 0x12, 0x18, 0x0a, 0x14, 0x45, 0x72, 0x72, 0x42, 0x72, 0x69, 0x64, 0x67,
	0x65, 0x49, 0x6e, 0x74, 0x65, 0x72, 0x72, 0x75, 0x70, 0x74, 0x65, 0x64, 0x10, 0x65, 0x12, 0x13,
	0x0a, 0x0f, 0x45, 0x72, 0x72, 0x4d, 0x69, 0x73, 0x73, 0x69, 0x6e, 0x67, 0x49, 0x6e, 0x70, 0x75,
	0x74, 0x10, 0x66, 0x12, 0x14, 0x0a, 0x10, 0x45, 0x72, 0x72, 0x53, 0x65, 0x72, 0x69, 0x61, 0x6c,
	0x69, 0x7a, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x10, 0x67, 0x12, 0x16, 0x0a, 0x12, 0x45, 0x72, 0x72,
	0x44, 0x65, 0x73, 0x65, 0x72, 0x69, 0x61, 0x6c, 0x69, 0x7a, 0x61, 0x74, 0x69, 0x6f, 0x6e, 0x10,
	0x68, 0x12, 0x12, 0x0a, 0x0e, 0x45, 0x72, 0x72, 0x49, 0x6e, 0x69, 0x74, 0x53, 0x65, 0x72, 0x76,
	0x69, 0x63, 0x65, 0x10, 0x69, 0x12, 0x15, 0x0a, 0x10, 0x45, 0x72, 0x72, 0x52, 0x75, 0x6e, 0x47,
	0x52, 0x50, 0x43, 0x53, 0x65, 0x72, 0x76, 0x65, 0x72, 0x10, 0x99, 0x01, 0x32, 0xb2, 0x02, 0x0a,
	0x13, 0x47, 0x6e, 0x6f, 0x6b, 0x65, 0x79, 0x4d, 0x6f, 0x62, 0x69, 0x6c, 0x65, 0x53, 0x65, 0x72,
	0x76, 0x69, 0x63, 0x65, 0x12, 0x5e, 0x0a, 0x09, 0x47, 0x65, 0x74, 0x52, 0x65, 0x6d, 0x6f, 0x74,
	0x65, 0x12, 0x27, 0x2e, 0x6c, 0x61, 0x6e, 0x64, 0x2e, 0x67, 0x6e, 0x6f, 0x2e, 0x67, 0x6e, 0x6f,
	0x6e, 0x61, 0x74, 0x69, 0x76, 0x65, 0x2e, 0x76, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x52, 0x65, 0x6d,
	0x6f, 0x74, 0x65, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x28, 0x2e, 0x6c, 0x61, 0x6e,
	0x64, 0x2e, 0x67, 0x6e, 0x6f, 0x2e, 0x67, 0x6e, 0x6f, 0x6e, 0x61, 0x74, 0x69, 0x76, 0x65, 0x2e,
	0x76, 0x31, 0x2e, 0x47, 0x65, 0x74, 0x52, 0x65, 0x6d, 0x6f, 0x74, 0x65, 0x52, 0x65, 0x73, 0x70,
	0x6f, 0x6e, 0x73, 0x65, 0x12, 0x64, 0x0a, 0x0b, 0x4c, 0x69, 0x73, 0x74, 0x4b, 0x65, 0x79, 0x49,
	0x6e, 0x66, 0x6f, 0x12, 0x29, 0x2e, 0x6c, 0x61, 0x6e, 0x64, 0x2e, 0x67, 0x6e, 0x6f, 0x2e, 0x67,
	0x6e, 0x6f, 0x6e, 0x61, 0x74, 0x69, 0x76, 0x65, 0x2e, 0x76, 0x31, 0x2e, 0x4c, 0x69, 0x73, 0x74,
	0x4b, 0x65, 0x79, 0x49, 0x6e, 0x66, 0x6f, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x2a,
	0x2e, 0x6c, 0x61, 0x6e, 0x64, 0x2e, 0x67, 0x6e, 0x6f, 0x2e, 0x67, 0x6e, 0x6f, 0x6e, 0x61, 0x74,
	0x69, 0x76, 0x65, 0x2e, 0x76, 0x31, 0x2e, 0x4c, 0x69, 0x73, 0x74, 0x4b, 0x65, 0x79, 0x49, 0x6e,
	0x66, 0x6f, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73, 0x65, 0x12, 0x55, 0x0a, 0x06, 0x53, 0x69,
	0x67, 0x6e, 0x54, 0x78, 0x12, 0x24, 0x2e, 0x6c, 0x61, 0x6e, 0x64, 0x2e, 0x67, 0x6e, 0x6f, 0x2e,
	0x67, 0x6e, 0x6f, 0x6e, 0x61, 0x74, 0x69, 0x76, 0x65, 0x2e, 0x76, 0x31, 0x2e, 0x53, 0x69, 0x67,
	0x6e, 0x54, 0x78, 0x52, 0x65, 0x71, 0x75, 0x65, 0x73, 0x74, 0x1a, 0x25, 0x2e, 0x6c, 0x61, 0x6e,
	0x64, 0x2e, 0x67, 0x6e, 0x6f, 0x2e, 0x67, 0x6e, 0x6f, 0x6e, 0x61, 0x74, 0x69, 0x76, 0x65, 0x2e,
	0x76, 0x31, 0x2e, 0x53, 0x69, 0x67, 0x6e, 0x54, 0x78, 0x52, 0x65, 0x73, 0x70, 0x6f, 0x6e, 0x73,
	0x65, 0x42, 0x33, 0x5a, 0x2b, 0x67, 0x69, 0x74, 0x68, 0x75, 0x62, 0x2e, 0x63, 0x6f, 0x6d, 0x2f,
	0x67, 0x6e, 0x6f, 0x6c, 0x61, 0x6e, 0x67, 0x2f, 0x67, 0x6e, 0x6f, 0x6b, 0x65, 0x79, 0x2d, 0x6d,
	0x6f, 0x62, 0x69, 0x6c, 0x65, 0x2f, 0x61, 0x70, 0x69, 0x2f, 0x67, 0x65, 0x6e, 0x2f, 0x67, 0x6f,
	0xa2, 0x02, 0x03, 0x52, 0x54, 0x47, 0x62, 0x06, 0x70, 0x72, 0x6f, 0x74, 0x6f, 0x33,
}

var (
	file_gnokey_mobile_rpc_proto_rawDescOnce sync.Once
	file_gnokey_mobile_rpc_proto_rawDescData = file_gnokey_mobile_rpc_proto_rawDesc
)

func file_gnokey_mobile_rpc_proto_rawDescGZIP() []byte {
	file_gnokey_mobile_rpc_proto_rawDescOnce.Do(func() {
		file_gnokey_mobile_rpc_proto_rawDescData = protoimpl.X.CompressGZIP(file_gnokey_mobile_rpc_proto_rawDescData)
	})
	return file_gnokey_mobile_rpc_proto_rawDescData
}

var file_gnokey_mobile_rpc_proto_enumTypes = make([]protoimpl.EnumInfo, 1)
var file_gnokey_mobile_rpc_proto_msgTypes = make([]protoimpl.MessageInfo, 1)
var file_gnokey_mobile_rpc_proto_goTypes = []any{
	(ErrCode)(0),                    // 0: land.gno.gnokey_mobile.v1.ErrCode
	(*ErrDetails)(nil),              // 1: land.gno.gnokey_mobile.v1.ErrDetails
	(*_go.GetRemoteRequest)(nil),    // 2: land.gno.gnonative.v1.GetRemoteRequest
	(*_go.ListKeyInfoRequest)(nil),  // 3: land.gno.gnonative.v1.ListKeyInfoRequest
	(*_go.SignTxRequest)(nil),       // 4: land.gno.gnonative.v1.SignTxRequest
	(*_go.GetRemoteResponse)(nil),   // 5: land.gno.gnonative.v1.GetRemoteResponse
	(*_go.ListKeyInfoResponse)(nil), // 6: land.gno.gnonative.v1.ListKeyInfoResponse
	(*_go.SignTxResponse)(nil),      // 7: land.gno.gnonative.v1.SignTxResponse
}
var file_gnokey_mobile_rpc_proto_depIdxs = []int32{
	0, // 0: land.gno.gnokey_mobile.v1.ErrDetails.codes:type_name -> land.gno.gnokey_mobile.v1.ErrCode
	2, // 1: land.gno.gnokey_mobile.v1.GnokeyMobileService.GetRemote:input_type -> land.gno.gnonative.v1.GetRemoteRequest
	3, // 2: land.gno.gnokey_mobile.v1.GnokeyMobileService.ListKeyInfo:input_type -> land.gno.gnonative.v1.ListKeyInfoRequest
	4, // 3: land.gno.gnokey_mobile.v1.GnokeyMobileService.SignTx:input_type -> land.gno.gnonative.v1.SignTxRequest
	5, // 4: land.gno.gnokey_mobile.v1.GnokeyMobileService.GetRemote:output_type -> land.gno.gnonative.v1.GetRemoteResponse
	6, // 5: land.gno.gnokey_mobile.v1.GnokeyMobileService.ListKeyInfo:output_type -> land.gno.gnonative.v1.ListKeyInfoResponse
	7, // 6: land.gno.gnokey_mobile.v1.GnokeyMobileService.SignTx:output_type -> land.gno.gnonative.v1.SignTxResponse
	4, // [4:7] is the sub-list for method output_type
	1, // [1:4] is the sub-list for method input_type
	1, // [1:1] is the sub-list for extension type_name
	1, // [1:1] is the sub-list for extension extendee
	0, // [0:1] is the sub-list for field type_name
}

func init() { file_gnokey_mobile_rpc_proto_init() }
func file_gnokey_mobile_rpc_proto_init() {
	if File_gnokey_mobile_rpc_proto != nil {
		return
	}
	if !protoimpl.UnsafeEnabled {
		file_gnokey_mobile_rpc_proto_msgTypes[0].Exporter = func(v any, i int) any {
			switch v := v.(*ErrDetails); i {
			case 0:
				return &v.state
			case 1:
				return &v.sizeCache
			case 2:
				return &v.unknownFields
			default:
				return nil
			}
		}
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: file_gnokey_mobile_rpc_proto_rawDesc,
			NumEnums:      1,
			NumMessages:   1,
			NumExtensions: 0,
			NumServices:   1,
		},
		GoTypes:           file_gnokey_mobile_rpc_proto_goTypes,
		DependencyIndexes: file_gnokey_mobile_rpc_proto_depIdxs,
		EnumInfos:         file_gnokey_mobile_rpc_proto_enumTypes,
		MessageInfos:      file_gnokey_mobile_rpc_proto_msgTypes,
	}.Build()
	File_gnokey_mobile_rpc_proto = out.File
	file_gnokey_mobile_rpc_proto_rawDesc = nil
	file_gnokey_mobile_rpc_proto_goTypes = nil
	file_gnokey_mobile_rpc_proto_depIdxs = nil
}
