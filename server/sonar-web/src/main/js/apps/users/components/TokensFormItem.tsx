/*
 * SonarQube
 * Copyright (C) 2009-2022 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { revokeToken } from '../../../api/user-tokens';
import { Button } from '../../../components/controls/buttons';
import ConfirmButton from '../../../components/controls/ConfirmButton';
import DateFormatter from '../../../components/intl/DateFormatter';
import DateFromNow from '../../../components/intl/DateFromNow';
import DeferredSpinner from '../../../components/ui/DeferredSpinner';
import { translate } from '../../../helpers/l10n';
import { UserToken } from '../../../types/token';

export type TokenDeleteConfirmation = 'inline' | 'modal';

interface Props {
  deleteConfirmation: TokenDeleteConfirmation;
  login: string;
  onRevokeToken: (token: UserToken) => void;
  token: UserToken;
}

interface State {
  loading: boolean;
  showConfirmation: boolean;
}

export default class TokensFormItem extends React.PureComponent<Props, State> {
  mounted = false;
  state: State = { loading: false, showConfirmation: false };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleClick = () => {
    if (this.state.showConfirmation) {
      this.handleRevoke().then(() => {
        if (this.mounted) {
          this.setState({ showConfirmation: false });
        }
      });
    } else {
      this.setState({ showConfirmation: true });
    }
  };

  handleRevoke = () => {
    this.setState({ loading: true });
    return revokeToken({ login: this.props.login, name: this.props.token.name }).then(
      () => this.props.onRevokeToken(this.props.token),
      () => {
        if (this.mounted) {
          this.setState({ loading: false });
        }
      }
    );
  };

  render() {
    const { deleteConfirmation, token } = this.props;
    const { loading, showConfirmation } = this.state;
    return (
      <tr>
        <td title={token.name} className="hide-overflow nowrap">
          {token.name}
        </td>
        <td title={translate('users.tokens', token.type)} className="hide-overflow thin">
          {translate('users.tokens', token.type, 'short')}
        </td>
        <td title={token.project?.name} className="hide-overflow">
          {token.project?.name}
        </td>
        <td className="thin nowrap">
          <DateFromNow date={token.lastConnectionDate} hourPrecision={true} />
        </td>
        <td className="thin nowrap text-right">
          <DateFormatter date={token.createdAt} long={true} />
        </td>
        <td className="thin nowrap text-right">
          <DeferredSpinner loading={loading}>
            <i className="deferred-spinner-placeholder" />
          </DeferredSpinner>
          {deleteConfirmation === 'modal' ? (
            <ConfirmButton
              confirmButtonText={translate('users.tokens.revoke_token')}
              isDestructive={true}
              modalBody={
                <FormattedMessage
                  defaultMessage={translate('users.tokens.sure_X')}
                  id="users.tokens.sure_X"
                  values={{ token: <strong>{token.name}</strong> }}
                />
              }
              modalHeader={translate('users.tokens.revoke_token')}
              onConfirm={this.handleRevoke}>
              {({ onClick }) => (
                <Button
                  className="spacer-left button-red input-small"
                  disabled={loading}
                  onClick={onClick}
                  title={translate('users.tokens.revoke_token')}>
                  {translate('users.tokens.revoke')}
                </Button>
              )}
            </ConfirmButton>
          ) : (
            <Button
              className="button-red input-small spacer-left"
              disabled={loading}
              onClick={this.handleClick}>
              {showConfirmation ? translate('users.tokens.sure') : translate('users.tokens.revoke')}
            </Button>
          )}
        </td>
      </tr>
    );
  }
}
