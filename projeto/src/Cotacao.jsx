import React, { useState } from 'react';

export default function CotacaoComData() {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [dados, setDados] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split('-');
    return `${ano}${mes}${dia}`;
  };

  const buscarCotacao = async () => {
    if (!dataInicio || !dataFim) {
      alert('Preencha as datas de início e fim.');
      return;
    }

    const inicioFormatado = formatarData(dataInicio);
    const fimFormatado = formatarData(dataFim);

    const url = `https://economia.awesomeapi.com.br/json/daily/USD-BRL/365?start_date=${inicioFormatado}&end_date=${fimFormatado}`;

    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch(url);
      const json = await response.json();
      setDados(json);
    } catch (err) {
      setErro('Erro ao buscar dados.');
    } finally {
      setCarregando(false);
    }
  };

  // Função para limpar campos e resultados
  const limparBusca = () => {
    setDataInicio('');
    setDataFim('');
    setDados([]);
    setErro(null);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Buscar Cotação USD/BRL</h2>

      <div>
        <label>
          Data Início:
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Data Fim:
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </label>
      </div>

      <div>
        <button onClick={buscarCotacao}>Buscar</button>
        <button onClick={limparBusca} style={{ marginLeft: '1rem' }}>
          Limpar
        </button>
      </div>

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}

      {dados.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Valor (R$)</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <tr key={item.timestamp}>
                <td>{new Date(item.timestamp * 1000).toLocaleDateString()}</td>
                <td>{parseFloat(item.bid).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
