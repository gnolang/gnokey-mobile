// This file implements the gRPC API methods defined in api/rpc.proto . For documentation,
// see that file and related request/response fields in the generated api/gnokeymobiletypes.proto .

package service

import (
	"context"

	"connectrpc.com/connect"

	"github.com/gnolang/gno/tm2/pkg/amino"
	"github.com/gnolang/gno/tm2/pkg/std"
	gnonative_api_gen "github.com/gnolang/gnonative/api/gen/go"
	gnonative_service "github.com/gnolang/gnonative/service"
)

func (s *gnokeyMobileService) GetRemote(ctx context.Context, req *connect.Request[gnonative_api_gen.GetRemoteRequest]) (*connect.Response[gnonative_api_gen.GetRemoteResponse], error) {
	// Imitate gnoNativeService.GetRemote
	return connect.NewResponse(&gnonative_api_gen.GetRemoteResponse{Remote: s.gnoNativeService.ClientGetRemote()}), nil
}

func (s *gnokeyMobileService) ListKeyInfo(ctx context.Context, req *connect.Request[gnonative_api_gen.ListKeyInfoRequest]) (*connect.Response[gnonative_api_gen.ListKeyInfoResponse], error) {
	// Imitate gnoNativeService.ListKeyInfo
	s.logger.Debug("ListKeyInfo called")

	keys, err := s.gnoNativeService.ClientListKeyInfo()
	if err != nil {
		return nil, err
	}

	formatedKeys := make([]*gnonative_api_gen.KeyInfo, 0)

	for _, key := range keys {
		info, err := gnonative_service.ConvertKeyInfo(key)
		if err != nil {
			return nil, err
		}

		formatedKeys = append(formatedKeys, info)
	}

	return connect.NewResponse(&gnonative_api_gen.ListKeyInfoResponse{Keys: formatedKeys}), nil
}

func (s *gnokeyMobileService) SignTx(ctx context.Context, req *connect.Request[gnonative_api_gen.SignTxRequest]) (*connect.Response[gnonative_api_gen.SignTxResponse], error) {
	// Imitate gnoNativeService.SignTx
	var tx std.Tx
	if err := amino.UnmarshalJSON([]byte(req.Msg.TxJson), &tx); err != nil {
		return nil, err
	}

	signedTx, err := s.gnoNativeService.ClientSignTx(tx, req.Msg.Address, req.Msg.AccountNumber, req.Msg.SequenceNumber)
	if err != nil {
		return nil, err
	}

	signedTxJSON, err := amino.MarshalJSON(signedTx)
	if err != nil {
		return nil, err
	}
	return connect.NewResponse(&gnonative_api_gen.SignTxResponse{SignedTxJson: string(signedTxJSON)}), nil
}
